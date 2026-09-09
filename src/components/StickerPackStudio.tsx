"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createPack,
  getReaction,
  REACTIONS,
  type PackSticker,
  type PackState,
  type ReactionId,
} from "@/lib/sticker-pack/types";
import {
  prepareReferenceImage,
  UPLOAD_ERROR_MESSAGES,
  type UploadValidationError,
} from "@/lib/sticker-pack/upload";
import { runSerialQueue, isRetryablePackError } from "@/lib/sticker-pack/schedule";
import {
  generateAndProcessSticker,
  retryCleanupOnly,
  type StickerOutcome,
} from "@/lib/sticker-pack/pipeline";
import {
  BackgroundRemovalError,
  downloadBlob,
  zipStickerPack,
  dataUrlToBlob,
  prefetchBackgroundModel,
} from "@/lib/sticker-pack/image-processing";
import {
  trackPackEvent,
  trackPackEventBeacon,
  landingContext,
  fileSizeBucket,
  dimensionBucket,
  providerStatusFromError,
} from "@/lib/sticker-pack/analytics";
import {
  clearPackSession,
  completedCount as sessionCompleted,
  hasCompletableWork,
  loadPackSession,
  missingReactions,
  savePackSession,
  type PackSessionState,
} from "@/lib/sticker-pack/session";

type Phase = "upload" | "preview" | "generating" | "ready" | "restored";

function updateSticker(
  setPack: React.Dispatch<React.SetStateAction<PackState | null>>,
  reaction: ReactionId,
  patch: Partial<PackSticker>,
) {
  setPack((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      stickers: prev.stickers.map((s) => (s.reaction === reaction ? { ...s, ...patch } : s)),
    };
  });
}

export default function StickerPackStudio({
  landingId = "/",
  uploadTitle = "Upload a Photo",
  uploadHint = "A face, a pet, a character — one clear photo works best. JPG, PNG or WebP, up to 10 MB.",
  uploadCta = "Choose Photo",
}: {
  landingId?: string;
  uploadTitle?: string;
  uploadHint?: string;
  uploadCta?: string;
}) {
  const [phase, setPhase] = useState<Phase>("upload");
  const [pack, setPack] = useState<PackState | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  const referenceDataRef = useRef<string>("");
  const [uploadError, setUploadError] = useState("");
  const [lightbox, setLightbox] = useState<{ url: string; label: string } | null>(null);
  const [zipping, setZipping] = useState(false);
  const cancelRef = useRef(false);
  const busyReactionRef = useRef<ReactionId | null>(null);

  // Funnel bookkeeping
  const generationStartRef = useRef<number>(0);
  const packIdRef = useRef<string>("");
  const firstStickerRef = useRef(false);
  const threeStickerRef = useRef(false);
  const firstDownloadRef = useRef(false);
  const interruptedRef = useRef(false); // generation started but not finished
  const stickerDurationsRef = useRef<Record<string, number>>({});
  const uploadMetaRef = useRef<{
    file: File | null;
    width: number;
    height: number;
  }>({ file: null, width: 0, height: 0 });

  const completedCount =
    pack?.stickers.filter((s) => s.status === "completed" || s.cleanupError).length ?? 0;
  const failedCount =
    pack?.stickers.filter((s) => s.status === "failed" && !s.cleanupError).length ?? 0;
  const generating = phase === "generating";

  // --- Landing view + session restore + abandonment beacon ---
  useEffect(() => {
    trackPackEvent("sticker_pack_view", { landingPage: landingId, ...landingContext() });

    const session = loadPackSession();
    if (session && (sessionCompleted(session) > 0 || hasCompletableWork(session))) {
      const restoredPack: PackState = {
        packId: session.packId,
        stickers: session.stickers.map((s) => ({
          id: `${s.reaction}_${Math.random().toString(36).slice(2, 8)}`,
          reaction: s.reaction,
          status: s.status,
          imageUrl: s.imageUrl,
          originalUrl: s.originalUrl,
          cleanupError: s.cleanupError,
        })),
      };
      packIdRef.current = session.packId;
      generationStartRef.current = session.startedAt;
      setPack(restoredPack);
      setPhase("restored");
    }

    const onPageHide = () => {
      if (!interruptedRef.current) return;
      trackPackEventBeacon("pack_abandoned", {
        packId: packIdRef.current,
        completedCount,
        elapsedMs: Date.now() - generationStartRef.current,
        packStatus: generating ? "generating" : "incomplete",
      });
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Leave-page protection while a pack is in flight ---
  useEffect(() => {
    if (!generating || completedCount >= 6) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [generating, completedCount]);

  const persistSession = useCallback((current: PackState) => {
    savePackSession({
      packId: current.packId,
      startedAt: generationStartRef.current || Date.now(),
      savedAt: Date.now(),
      stickers: current.stickers.map((s) => ({
        reaction: s.reaction,
        status: s.status,
        imageUrl: s.imageUrl,
        originalUrl: s.originalUrl,
        cleanupError: s.cleanupError,
      })),
    });
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined, opts?: { resume?: boolean }) => {
      if (!file) return;
      trackPackEvent("photo_upload_clicked", { landingPage: landingId });
      setUploadError("");
      const result = await prepareReferenceImage(file, undefined, (w, h) => {
        uploadMetaRef.current = { file, width: w, height: h };
      });
      if (result.error) {
        setUploadError(UPLOAD_ERROR_MESSAGES[result.error as UploadValidationError]);
        return;
      }
      referenceDataRef.current = result.dataUrl;
      setReferenceUrl(result.dataUrl);
      trackPackEvent("photo_uploaded", {
        landingPage: landingId,
        fileType: file.type,
        fileSizeBucket: fileSizeBucket(file.size),
        imageDimensionBucket: dimensionBucket(
          uploadMetaRef.current.width || 1024,
          uploadMetaRef.current.height || 1024,
        ),
      });
      // Warm the ~54MB bg-removal model into HTTP cache while the first
      // generation runs — no first-sticker wait on model download later.
      void prefetchBackgroundModel();
      if (opts?.resume) {
        setPhase("generating");
        void resumeGeneration();
      } else {
        clearPackSession();
        setPhase("preview");
      }
    },
    [landingId],
  );

  const reportProviderError = useCallback((reaction: string, error: unknown, willRetry: boolean) => {
    const message = error instanceof Error ? error.message : String(error);
    const status = providerStatusFromError(message);
    if (status === 429) trackPackEvent("provider_429", { reaction });
    else if (status !== null && status >= 500) trackPackEvent("provider_5xx", { reaction });
    else if (/network|timed out|timeout/i.test(message)) trackPackEvent("provider_timeout", { reaction });
    if (willRetry) trackPackEvent("sticker_retry", { reaction });
  }, []);

  /** User-facing failure copy: network drops need a different action (check
   *  connection / proxy) than provider-side generation failures. */
  const failureCopy = useCallback((error: unknown): string => {
    const message = error instanceof Error ? error.message : String(error);
    if (/network/i.test(message)) {
      return "Connection lost — check your network (or VPN/proxy) and retry.";
    }
    if (/timed out|timeout/i.test(message)) {
      return "Timed out — connection was slow. Retry.";
    }
    const status = providerStatusFromError(message);
    if (status === 429) return "Server busy — retry in a moment.";
    return "Generation failed. Tap retry.";
  }, []);

  const runSticker = useCallback(
    async (reaction: ReactionId): Promise<StickerOutcome> => {
      const startedAt = Date.now();
      updateSticker(setPack, reaction, { status: "generating", error: undefined, durationMs: undefined });
      const outcome = await generateAndProcessSticker(reaction, referenceDataRef.current);
      if (outcome.cleanupError) {
        updateSticker(setPack, reaction, {
          status: "completed",
          originalUrl: outcome.originalUrl,
          imageUrl: undefined,
          cleanupError: outcome.cleanupError,
          durationMs: Date.now() - startedAt,
        });
        trackPackEvent("background_removal_failed", { reaction, reason: "cleanup" });
      } else if (outcome.processed) {
        updateSticker(setPack, reaction, {
          status: "completed",
          originalUrl: outcome.originalUrl,
          imageUrl: outcome.processed.dataUrl,
          cleanupError: undefined,
          durationMs: Date.now() - startedAt,
        });
      }
      trackPackEvent("sticker_generation_completed", { reaction, durationMs: Date.now() - startedAt });
      stickerDurationsRef.current[reaction] = Date.now() - startedAt;
      return outcome;
    },
    [],
  );

  // Progressive funnel milestones are derived in the queue callbacks so the
  // logic stays in one place whether it's a fresh pack or a resume.
  const makeQueueCallbacks = useCallback(
    () => ({
      onTaskError: (id: string, error: unknown, _attempt: number, willRetry: boolean) =>
        reportProviderError(id, error, willRetry),
      onTaskSettled: (id: string, _index: number, result: StickerOutcome | null, error: unknown) => {
        if (error !== null) {
          trackPackEvent("sticker_generation_failed", { reaction: id });
          updateSticker(setPack, id as ReactionId, {
            status: "failed",
            error: failureCopy(error),
          });
        }
        setPack((prev) => {
          if (!prev) return prev;
          const done = prev.stickers.filter((s) => s.status === "completed").length;
          const now = Date.now();
          if (done >= 1 && !firstStickerRef.current) {
            firstStickerRef.current = true;
            trackPackEvent("pack_first_sticker_ready", {
              packId: prev.packId,
              reaction: id,
              timeToFirstStickerMs: now - generationStartRef.current,
              generationDurationMs: stickerDurationsRef.current[id],
            });
          }
          if (done >= 3 && !threeStickerRef.current) {
            threeStickerRef.current = true;
            trackPackEvent("pack_three_stickers_ready", {
              packId: prev.packId,
              elapsedMs: now - generationStartRef.current,
            });
          }
          return prev; // no state change — side-effect only via refs/trackers
        });
      },
    }),
    [reportProviderError],
  );

  const afterQueueSettled = useCallback(
    (freshPack: PackState, succeeded: number, failed: number) => {
      setPack((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          // Tasks cancelled mid-queue (Stop) never settle — mark those only;
          // settled failures keep their detailed error copy from onTaskSettled.
          stickers: prev.stickers.map((s) =>
            s.status === "queued" || s.status === "generating"
              ? { ...s, status: "failed" as const, error: "Stopped — tap retry to continue." }
              : s,
          ),
        };
      });
      setPack((prev) => {
        if (prev) persistSession(prev);
        return prev;
      });
      interruptedRef.current = false;
      setPhase("ready");
      trackPackEvent("pack_completed", {
        packId: freshPack.packId,
        totalDurationMs: Date.now() - generationStartRef.current,
        successCount: succeeded,
        failedCount: failed,
        completed: succeeded,
        total: 6,
        success: failed === 0,
      });
    },
    [persistSession],
  );

  const startGeneration = useCallback(
    async (only?: ReactionId[]) => {
      if (!referenceDataRef.current) return;
      cancelRef.current = false;
      firstStickerRef.current = false;
      threeStickerRef.current = false;
      const freshPack = createPack();
      packIdRef.current = freshPack.packId;
      generationStartRef.current = Date.now();
      interruptedRef.current = true;

      const existing = pack;
      const baseStickers = only
        ? REACTIONS.map((r) => {
            const kept = existing?.stickers.find((s) => s.reaction === r.id && s.status === "completed");
            return (
              kept ?? {
                id: `${r.id}_${Math.random().toString(36).slice(2, 8)}`,
                reaction: r.id,
                status: "queued" as const,
              }
            );
          })
        : freshPack.stickers;

      const effectivePack: PackState = { packId: freshPack.packId, stickers: baseStickers };
      setPack(effectivePack);
      setPhase("generating");
      trackPackEvent("pack_generation_started", {
        packId: freshPack.packId,
        packType: "reaction",
        stickerCount: 6,
        landingPage: landingId,
      });

      const tasks = (only ?? REACTIONS.map((r) => r.id)).map((id) => ({
        id,
        run: () => runSticker(id),
      }));
      const cbs = makeQueueCallbacks();
      const result = await runSerialQueue(tasks, {
        retries: 2,
        retryDelayMs: 6000,
        isRetryable: isRetryablePackError,
        shouldStop: () => cancelRef.current,
        onTaskError: cbs.onTaskError,
        onTaskSettled: (id, index, value, error) => {
          cbs.onTaskSettled(id, index, value, error);
          setPack((prev) => {
            if (prev) persistSession(prev);
            return prev;
          });
        },
      });

      afterQueueSettled(effectivePack, result.succeeded.length, result.failed.length);
    },
    [runSticker, makeQueueCallbacks, afterQueueSettled, pack, landingId, persistSession],
  );

  const resumeGeneration = useCallback(async () => {
    const session = loadPackSession();
    const missing = session ? missingReactions(session) : [];
    if (!session || missing.length === 0) return;
    interruptedRef.current = true;
    generationStartRef.current = session.startedAt;
    packIdRef.current = session.packId;
    trackPackEvent("pack_generation_started", {
      packId: session.packId,
      packType: "reaction-resume",
      stickerCount: missing.length,
      landingPage: landingId,
    });
    const cbs = makeQueueCallbacks();
    const result = await runSerialQueue(
      missing.map((id) => ({ id, run: () => runSticker(id) })),
      {
        retries: 2,
        retryDelayMs: 6000,
        isRetryable: isRetryablePackError,
        onTaskError: cbs.onTaskError,
        onTaskSettled: (id, index, value, error) => {
          cbs.onTaskSettled(id, index, value, error);
          setPack((prev) => {
            if (prev) persistSession(prev);
            return prev;
          });
        },
      },
    );
    afterQueueSettled({ packId: session.packId, stickers: [] }, result.succeeded.length, result.failed.length);
  }, [runSticker, makeQueueCallbacks, afterQueueSettled, landingId, persistSession]);

  const handleCancel = useCallback(() => {
    cancelRef.current = true;
    interruptedRef.current = false;
  }, []);

  const handleRegenerate = useCallback(
    async (reaction: ReactionId) => {
      if (busyReactionRef.current) return;
      busyReactionRef.current = reaction;
      trackPackEvent("single_sticker_regenerated", { reaction });
      try {
        await runSticker(reaction);
        setPack((prev) => {
          if (prev) persistSession(prev);
          return prev;
        });
      } finally {
        busyReactionRef.current = null;
      }
    },
    [runSticker, persistSession],
  );

  const handleRetryCleanup = useCallback(
    async (reaction: ReactionId) => {
      const sticker = pack?.stickers.find((s) => s.reaction === reaction);
      if (!sticker?.originalUrl) return;
      updateSticker(setPack, reaction, { status: "processing", cleanupError: undefined });
      try {
        const processed = await retryCleanupOnly(sticker.originalUrl);
        updateSticker(setPack, reaction, { status: "completed", imageUrl: processed.dataUrl });
        trackPackEvent("background_removal_completed", { reaction });
      } catch (error) {
        updateSticker(setPack, reaction, {
          status: "completed",
          cleanupError: error instanceof BackgroundRemovalError ? error.message : "Background cleanup failed",
        });
        trackPackEvent("background_removal_failed", { reaction, reason: "retry" });
      }
      setPack((prev) => {
        if (prev) persistSession(prev);
        return prev;
      });
    },
    [pack, persistSession],
  );

  const handleDownloadOne = useCallback(
    async (sticker: PackSticker) => {
      const url = sticker.imageUrl ?? sticker.originalUrl;
      if (!url) return;
      const elapsed = generationStartRef.current
        ? Date.now() - generationStartRef.current
        : undefined;
      trackPackEvent("single_sticker_downloaded", {
        reaction: sticker.reaction,
        completedCount,
        elapsedSinceGenerationStartMs: elapsed,
      });
      if (!firstDownloadRef.current) {
        firstDownloadRef.current = true;
        trackPackEvent("first_sticker_downloaded", {
          reaction: sticker.reaction,
          completedCount,
          elapsedSinceGenerationStartMs: elapsed,
        });
      }
      downloadBlob(await dataUrlToBlob(url), `stickersit-${sticker.reaction}.png`);
    },
    [completedCount],
  );

  const handleDownloadPack = useCallback(async () => {
    if (!pack) return;
    setZipping(true);
    try {
      const usable = pack.stickers.filter((s) => s.imageUrl || s.originalUrl);
      const entries = usable.map((s) => ({ reaction: s.reaction, dataUrl: s.imageUrl ?? s.originalUrl! }));
      downloadBlob(await zipStickerPack(entries), "stickersit-reaction-pack.zip");
      trackPackEvent("pack_downloaded", {
        packId: pack.packId,
        completed: usable.length,
        completedCount: usable.length,
        total: 6,
        elapsedSinceGenerationStartMs: generationStartRef.current
          ? Date.now() - generationStartRef.current
          : undefined,
      });
    } finally {
      setZipping(false);
    }
  }, [pack]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    interruptedRef.current = false;
    clearPackSession();
    firstDownloadRef.current = false;
    setPack(null);
    setReferenceUrl("");
    referenceDataRef.current = "";
    setPhase("upload");
    setUploadError("");
  }, []);

  const showFirstStickerBanner =
    generating && completedCount >= 1 && completedCount < 6 && firstStickerRef.current;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {phase === "upload" && (
        <UploadPanel
          onFile={handleFile}
          error={uploadError}
          title={uploadTitle}
          hint={uploadHint}
          cta={uploadCta}
        />
      )}

      {phase === "preview" && (
        <PreviewPanel
          referenceUrl={referenceUrl}
          onGenerate={() => startGeneration()}
          onReset={handleReset}
        />
      )}

      {phase === "restored" && pack && (
        <RestoredPanel
          pack={pack}
          onContinue={(file) => handleFile(file, { resume: true })}
          onDownloadOne={handleDownloadOne}
          onDownloadPack={handleDownloadPack}
          onReset={handleReset}
          zipping={zipping}
        />
      )}

      {(phase === "generating" || phase === "ready") && pack && (
        <ProgressPanel
          pack={pack}
          phase={phase}
          completedCount={completedCount}
          showFirstBanner={showFirstStickerBanner}
          onCancel={handleCancel}
          onReset={handleReset}
          onRegenerate={handleRegenerate}
          onRetryCleanup={handleRetryCleanup}
          onDownloadOne={handleDownloadOne}
          onDownloadPack={handleDownloadPack}
          onLightbox={setLightbox}
          zipping={zipping}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} sticker preview`}
        >
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0,0 10px,10px -10px,-10px 0px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox.url} alt={`${lightbox.label} sticker`} className="w-full" />
            </div>
            <p className="text-center text-sm font-medium mt-3">{lightbox.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadPanel({
  onFile,
  error,
  title,
  hint,
  cta,
}: {
  onFile: (file: File) => void;
  error: string;
  title: string;
  hint: string;
  cta: string;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <label
      className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-3xl px-6 py-14 cursor-pointer transition-colors ${
        dragging ? "border-violet-500 bg-violet-50" : "border-gray-300 bg-white hover:border-violet-400"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
    >
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <span className="text-5xl">📸</span>
      <span className="text-lg font-semibold text-gray-800">{title}</span>
      <span className="text-sm text-gray-500 text-center max-w-xs">{hint}</span>
      <span className="bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-full">
        {cta}
      </span>
      {error && <span className="text-sm text-red-500">{error}</span>}
      <span className="text-xs text-gray-400">
        Your photo stays on your device except for generation. We don&apos;t save it.
      </span>
    </label>
  );
}

function PreviewPanel({
  referenceUrl,
  onGenerate,
  onReset,
}: {
  referenceUrl: string;
  onGenerate: () => void;
  onReset: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center gap-5">
      <div className="rounded-2xl overflow-hidden border border-gray-200 w-40 h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={referenceUrl} alt="Uploaded reference photo" className="w-full h-full object-cover" />
      </div>
      <p className="text-sm text-gray-600 text-center max-w-sm">
        We&apos;ll create <strong>6 reaction stickers</strong> — laughing, love, shocked, angry, crying, sleepy —
        all keeping this character&apos;s look.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Create My Sticker Pack
        </button>
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-3">
          Change photo
        </button>
      </div>
      <p className="text-xs text-gray-400">
        First sticker in about 30 seconds · full pack in 3–5 minutes · keep this tab open
      </p>
    </div>
  );
}

function RestoredPanel({
  pack,
  onContinue,
  onDownloadOne,
  onDownloadPack,
  onReset,
  zipping,
}: {
  pack: PackState;
  onContinue: (file: File) => void;
  onDownloadOne: (sticker: PackSticker) => void;
  onDownloadPack: () => void;
  onReset: () => void;
  zipping: boolean;
}) {
  const done = pack.stickers.filter((s) => s.status === "completed").length;
  const missing = pack.stickers.filter((s) => s.status !== "completed").length;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-center max-w-md">
        <p className="text-sm font-semibold text-amber-800">
          Welcome back — {done} of 6 stickers were saved from your last visit
        </p>
        <p className="text-xs text-amber-700 mt-1">
          {missing > 0
            ? "To create the remaining stickers, re-upload the same photo (we never keep it) and pick up where you left off."
            : "Your full pack is ready below."}
        </p>
      </div>
      {missing > 0 && (
        <label className="bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm px-6 py-3 rounded-full cursor-pointer transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onContinue(file);
              e.target.value = "";
            }}
          />
          Resume My Pack ({missing} left)
        </label>
      )}
      <StickerGrid
        pack={pack}
        phase="ready"
        onRegenerate={() => {}}
        onRetryCleanup={() => {}}
        onDownloadOne={onDownloadOne}
        onLightbox={() => {}}
      />
      <div className="flex gap-3">
        <button
          onClick={onDownloadPack}
          disabled={zipping || done === 0}
          className="bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          {zipping ? "Packing…" : `Download Pack${done < 6 ? ` (${done})` : ""}`}
        </button>
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium px-6 py-3">
          Start over
        </button>
      </div>
    </div>
  );
}

function ProgressPanel({
  pack,
  phase,
  completedCount,
  showFirstBanner,
  onCancel,
  onReset,
  onRegenerate,
  onRetryCleanup,
  onDownloadOne,
  onDownloadPack,
  onLightbox,
  zipping,
}: {
  pack: PackState;
  phase: Phase;
  completedCount: number;
  showFirstBanner: boolean;
  onCancel: () => void;
  onReset: () => void;
  onRegenerate: (reaction: ReactionId) => void;
  onRetryCleanup: (reaction: ReactionId) => void;
  onDownloadOne: (sticker: PackSticker) => void;
  onDownloadPack: () => void;
  onLightbox: (value: { url: string; label: string }) => void;
  zipping: boolean;
}) {
  const generating = phase === "generating";
  const firstReady = pack.stickers.find((s) => s.status === "completed" && s.imageUrl);
  return (
    <div className="flex flex-col items-center gap-6">
      {showFirstBanner && firstReady && (
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-4 animate-[fadeIn_.3s_ease]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firstReady.imageUrl}
            alt={`${firstReady.reaction} sticker`}
            className="w-16 h-16 rounded-xl object-contain bg-white shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-bold text-emerald-800">Your first sticker is ready 🎉</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Download it now while we create the rest.
            </p>
          </div>
          <button
            onClick={() => onDownloadOne(firstReady)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shrink-0 transition-colors"
          >
            Download
          </button>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>{generating ? "Creating your sticker pack" : failedCountLabel(pack, completedCount)}</span>
          <span>{completedCount} of 6 stickers ready</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      <StickerGrid
        pack={pack}
        phase={phase}
        onRegenerate={onRegenerate}
        onRetryCleanup={onRetryCleanup}
        onDownloadOne={onDownloadOne}
        onLightbox={onLightbox}
      />

      <div className="flex gap-3 flex-wrap justify-center">
        {generating ? (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium px-6 py-3">
            Stop
          </button>
        ) : (
          <>
            <button
              onClick={onDownloadPack}
              disabled={zipping || completedCount === 0}
              className="bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              {zipping ? "Packing…" : `Download Pack${completedCount < 6 ? ` (${completedCount})` : ""}`}
            </button>
            <button onClick={onReset} className="text-gray-500 hover:text-gray-700 font-medium px-6 py-3">
              New photo
            </button>
          </>
        )}
      </div>
      {!generating && completedCount < 6 && (
        <p className="text-xs text-gray-400">
          {completedCount} of 6 stickers ready — retry the failed ones or download what you have.
        </p>
      )}
    </div>
  );
}

function StickerGrid({
  pack,
  phase,
  onRegenerate,
  onRetryCleanup,
  onDownloadOne,
  onLightbox,
}: {
  pack: PackState;
  phase: Phase;
  onRegenerate: (reaction: ReactionId) => void;
  onRetryCleanup: (reaction: ReactionId) => void;
  onDownloadOne: (sticker: PackSticker) => void;
  onLightbox: (value: { url: string; label: string }) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {REACTIONS.map((reaction) => {
        const sticker = pack.stickers.find((s) => s.reaction === reaction.id)!;
        return (
          <div
            key={reaction.id}
            className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-2 min-h-[190px]"
          >
            <StickerTile sticker={sticker} />
            <span className="text-xs font-medium text-gray-600">
              {reaction.emoji} {reaction.label}
            </span>
            {sticker.status === "queued" && (
              <span className="text-xs text-gray-400">Waiting…</span>
            )}
            {sticker.status === "generating" && (
              <span className="text-xs text-violet-500 animate-pulse">Drawing…</span>
            )}
            {sticker.status === "processing" && (
              <span className="text-xs text-violet-500 animate-pulse">Removing background…</span>
            )}
            {sticker.status === "failed" && (
              <>
                <span className="text-xs text-red-500">{sticker.error}</span>
                <button
                  onClick={() => onRegenerate(sticker.reaction)}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  Retry
                </button>
              </>
            )}
            {sticker.status === "completed" && (
              <>
                {sticker.cleanupError && (
                  <span className="text-[11px] text-amber-600 text-center">Background cleanup failed</span>
                )}
                <div className="flex gap-3 text-xs font-semibold">
                  <button
                    className="text-violet-600 hover:text-violet-700"
                    onClick={() =>
                      onLightbox({ url: sticker.imageUrl ?? sticker.originalUrl!, label: reaction.label })
                    }
                  >
                    View
                  </button>
                  <button
                    className="text-violet-600 hover:text-violet-700"
                    onClick={() => onRegenerate(sticker.reaction)}
                  >
                    Regenerate
                  </button>
                  <button
                    className="text-violet-600 hover:text-violet-700"
                    onClick={() => onDownloadOne(sticker)}
                  >
                    Download
                  </button>
                </div>
                {sticker.cleanupError && (
                  <div className="flex gap-3 text-[11px]">
                    <button
                      className="text-amber-600 hover:text-amber-700 font-semibold"
                      onClick={() => onRetryCleanup(sticker.reaction)}
                    >
                      Retry cleanup
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => onDownloadOne(sticker)}
                    >
                      Download original
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StickerTile({ sticker }: { sticker: PackSticker }) {
  const url = sticker.imageUrl ?? sticker.originalUrl;
  return (
    <div
      className={`w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center ${
        sticker.imageUrl ? "bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#ffffff_0%_50%)] bg-[length:16px_16px]" : "bg-gray-50"
      }`}
    >
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt={`${sticker.reaction} sticker`} className="w-full h-full object-contain" />
      ) : (
        <span className="text-3xl opacity-30">{getReaction(sticker.reaction)?.emoji}</span>
      )}
    </div>
  );
}

function failedCountLabel(pack: PackState, completed: number) {
  const failed = pack.stickers.filter((s) => s.status === "failed" && !s.cleanupError).length;
  if (failed > 0) return "Your pack is ready (with retries available)";
  return completed === 6 ? "Your sticker pack is ready 🎉" : "Your pack";
}
