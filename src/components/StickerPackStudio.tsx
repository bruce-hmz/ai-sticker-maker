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
} from "@/lib/sticker-pack/image-processing";
import { trackPackEvent } from "@/lib/sticker-pack/analytics";

type Phase = "upload" | "preview" | "generating" | "ready";

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

export default function StickerPackStudio() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [pack, setPack] = useState<PackState | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  const referenceDataRef = useRef<string>("");
  const [uploadError, setUploadError] = useState("");
  const [lightbox, setLightbox] = useState<{ url: string; label: string } | null>(null);
  const [zipping, setZipping] = useState(false);
  const cancelRef = useRef(false);
  const busyReactionRef = useRef<ReactionId | null>(null);

  useEffect(() => {
    trackPackEvent("sticker_pack_view");
  }, []);

  const completedCount = pack?.stickers.filter((s) => s.status === "completed" || s.cleanupError).length ?? 0;
  const failedCount = pack?.stickers.filter((s) => s.status === "failed" && !s.cleanupError).length ?? 0;

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    trackPackEvent("photo_upload_clicked");
    setUploadError("");
    const result = await prepareReferenceImage(file);
    if (result.error) {
      setUploadError(UPLOAD_ERROR_MESSAGES[result.error as UploadValidationError]);
      return;
    }
    referenceDataRef.current = result.dataUrl;
    setReferenceUrl(result.dataUrl);
    setPhase("preview");
    trackPackEvent("photo_uploaded");
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
          imageUrl: outcome.processed!.dataUrl,
          cleanupError: undefined,
          durationMs: Date.now() - startedAt,
        });
        trackPackEvent("background_removal_completed", { reaction, durationMs: Date.now() - startedAt });
      }
      trackPackEvent("sticker_generation_completed", { reaction, durationMs: Date.now() - startedAt });
      return outcome;
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (!referenceDataRef.current) return;
    cancelRef.current = false;
    const freshPack = createPack();
    setPack(freshPack);
    setPhase("generating");
    trackPackEvent("pack_generation_started", { packId: freshPack.packId, total: 6 });

    const result = await runSerialQueue(
      REACTIONS.map((r) => ({ id: r.id, run: () => runSticker(r.id) })),
      {
        retries: 2,
        retryDelayMs: 6000,
        isRetryable: isRetryablePackError,
        shouldStop: () => cancelRef.current,
      },
    );

    // Mark any task that never succeeded (stopped or exhausted retries).
    setPack((prev) => {
      if (!prev) return prev;
      const failedIds = new Set(result.failed.map((f) => f.id));
      return {
        ...prev,
        stickers: prev.stickers.map((s) =>
          failedIds.has(s.reaction) && s.status !== "completed"
            ? { ...s, status: "failed" as const, error: "Generation failed. Tap retry." }
            : s,
        ),
      };
    });

    for (const f of result.failed) {
      trackPackEvent("sticker_generation_failed", { reaction: f.id });
    }

    setPhase("ready");
    const done = result.succeeded.length;
    trackPackEvent("pack_completed", {
      packId: freshPack.packId,
      completed: done,
      total: 6,
      success: done === 6,
    });
  }, [runSticker]);

  const handleCancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const handleRegenerate = useCallback(
    async (reaction: ReactionId) => {
      if (busyReactionRef.current) return;
      busyReactionRef.current = reaction;
      trackPackEvent("single_sticker_regenerated", { reaction });
      try {
        await runSticker(reaction);
      } finally {
        busyReactionRef.current = null;
      }
    },
    [runSticker],
  );

  const handleRetryCleanup = useCallback(async (reaction: ReactionId) => {
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
  }, [pack]);

  const handleDownloadOne = useCallback(async (sticker: PackSticker) => {
    const url = sticker.imageUrl ?? sticker.originalUrl;
    if (!url) return;
    trackPackEvent("single_sticker_downloaded", { reaction: sticker.reaction });
    downloadBlob(await dataUrlToBlob(url), `stickersit-${sticker.reaction}.png`);
  }, []);

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
        total: 6,
      });
    } finally {
      setZipping(false);
    }
  }, [pack]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    setPack(null);
    setReferenceUrl("");
    referenceDataRef.current = "";
    setPhase("upload");
    setUploadError("");
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {phase === "upload" && (
        <UploadPanel onFile={handleFile} error={uploadError} />
      )}

      {phase === "preview" && (
        <PreviewPanel
          referenceUrl={referenceUrl}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />
      )}

      {(phase === "generating" || phase === "ready") && pack && (
        <ProgressPanel
          pack={pack}
          phase={phase}
          completedCount={completedCount}
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

function UploadPanel({ onFile, error }: { onFile: (file: File) => void; error: string }) {
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
      <span className="text-lg font-semibold text-gray-800">Upload a Photo</span>
      <span className="text-sm text-gray-500 text-center max-w-xs">
        A face, a pet, a character — one clear photo works best. JPG, PNG or WebP, up to 10 MB.
      </span>
      <span className="bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-full">
        Choose Photo
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
        We&apos;ll create <strong>6 reaction stickers</strong> — laughing, crying, angry, shocked, love, sleepy —
        all keeping this character&apos;s look.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Create My Sticker Pack
        </button>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-3"
        >
          Change photo
        </button>
      </div>
      <p className="text-xs text-gray-400">Takes about 2–3 minutes · progress updates live</p>
    </div>
  );
}

function ProgressPanel({
  pack,
  phase,
  completedCount,
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
  return (
    <div className="flex flex-col items-center gap-6">
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
                <span className="text-xs text-violet-500 animate-pulse">Cleaning background…</span>
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
                    <button className="text-violet-600 hover:text-violet-700" onClick={() => onLightbox({ url: sticker.imageUrl ?? sticker.originalUrl!, label: reaction.label })}>
                      View
                    </button>
                    <button className="text-violet-600 hover:text-violet-700" onClick={() => onRegenerate(sticker.reaction)}>
                      Regenerate
                    </button>
                    <button className="text-violet-600 hover:text-violet-700" onClick={() => onDownloadOne(sticker)}>
                      Download
                    </button>
                  </div>
                  {sticker.cleanupError && (
                    <div className="flex gap-3 text-[11px]">
                      <button className="text-amber-600 hover:text-amber-700 font-semibold" onClick={() => onRetryCleanup(sticker.reaction)}>
                        Retry cleanup
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" onClick={() => onDownloadOne(sticker)}>
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
