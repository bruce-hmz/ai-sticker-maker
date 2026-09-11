"use client";

// WTP research probes (docs/review-2026-09-16.md §4). Hard constraints:
//  1. Never shown before the user has results — the survey appears only after
//     a successful download, the pricing card only after a full 6/6 pack.
//  2. Exposure is tracked (wtp_probe_viewed) so CTR is computable; clicks
//     carry the answer (option / pricePoint) plus probeType/completedCount/landingPage.
//  3. No fake checkout — the pricing card asks "what would you pay" and says
//     plainly that nothing is for sale today.
// Both cards render null on the server (visibility depends on client-only
// state: download happened / pack completed), so the lazy session-retirement
// read in useState cannot cause hydration mismatches.

import { useEffect, useState } from "react";
import { trackPackEvent } from "@/lib/sticker-pack/analytics";
import {
  PRICE_POINTS,
  USE_CASE_OPTIONS,
  claimProbeView,
  isProbeRetired,
  retireProbe,
  type PricePoint,
  type UseCaseOption,
  type WtpProbeType,
} from "@/lib/sticker-pack/wtp-probe";

interface ProbeProps {
  visible: boolean;
  completedCount: number;
  landingPage: string;
}

function useProbeCard(probeType: WtpProbeType, { visible, completedCount, landingPage }: ProbeProps) {
  const [retired, setRetired] = useState(() => isProbeRetired(probeType));
  const [thanked, setThanked] = useState(false);

  // Fire-and-forget exposure once per session — claimProbeView is idempotent
  // via sessionStorage, so effect re-runs (completedCount ticking up, etc.)
  // never double-count.
  useEffect(() => {
    if (!visible || retired) return;
    if (claimProbeView(probeType)) {
      trackPackEvent("wtp_probe_viewed", { probeType, completedCount, landingPage });
    }
  }, [visible, retired, probeType, completedCount, landingPage]);

  // The thanked flash hides itself; the session flag already retired the probe.
  useEffect(() => {
    if (!thanked) return;
    const t = setTimeout(() => setThanked(false), 2500);
    return () => clearTimeout(t);
  }, [thanked]);

  const answer = (extra: { option?: UseCaseOption; pricePoint?: PricePoint }) => {
    retireProbe(probeType);
    setRetired(true);
    setThanked(true);
    trackPackEvent("wtp_probe_clicked", { probeType, ...extra, completedCount, landingPage });
  };

  const dismiss = () => {
    retireProbe(probeType);
    setRetired(true);
  };

  return { retired, thanked, answer, dismiss };
}

const USE_CASE_LABELS: Record<UseCaseOption, string> = {
  personal_chat: "Personal chats",
  print_physical: "Print them out",
  resell: "Sell them (Etsy, etc.)",
  client_work: "Client / design work",
  other: "Just for fun",
};

const PRICE_LABELS: Record<PricePoint, string> = {
  free: "Keep it free",
  "1.99": "$1.99",
  "4.99": "$4.99",
  "9.99_plus": "$9.99+",
};

function ProbeCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-md mx-auto mt-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-center animate-[fadeIn_.3s_ease]">
      {children}
    </section>
  );
}

function Chip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-3.5 py-2 rounded-full border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors"
    >
      {label}
    </button>
  );
}

/** One-question use-case survey, shown after the session's first successful download. */
export function WtpUseCaseSurvey(props: ProbeProps) {
  const { retired, thanked, answer, dismiss } = useProbeCard("use_case", props);
  if (!props.visible) return null;
  if (thanked) {
    return (
      <ProbeCard>
        <p className="text-sm font-medium text-gray-700">Thanks — that helps a lot 🙌</p>
      </ProbeCard>
    );
  }
  if (retired) return null;
  return (
    <ProbeCard>
      <p className="text-sm font-semibold text-gray-800">
        Quick question — what will you use your stickers for?
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {USE_CASE_OPTIONS.map((option) => (
          <Chip key={option} label={USE_CASE_LABELS[option]} onClick={() => answer({ option })} />
        ))}
      </div>
      <button onClick={dismiss} className="mt-2.5 text-xs text-gray-400 hover:text-gray-600">
        No thanks
      </button>
    </ProbeCard>
  );
}

/** "What would you pay" pricing card, shown only after a full 6/6 pack. */
export function WtpPricingProbe(props: ProbeProps) {
  const { retired, thanked, answer, dismiss } = useProbeCard("pricing_door", props);
  if (!props.visible) return null;
  if (thanked) {
    return (
      <ProbeCard>
        <p className="text-sm font-medium text-gray-700">
          Thanks — this helps us decide what to build next 🙌
        </p>
      </ProbeCard>
    );
  }
  if (retired) return null;
  return (
    <ProbeCard>
      <p className="text-sm font-semibold text-gray-800">HD Pro Pack — coming soon</p>
      <p className="text-xs text-gray-500 mt-1">
        Print-ready sizes, watermark-free, full-quality ZIP. What would you pay for it?
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {PRICE_POINTS.map((pricePoint) => (
          <Chip
            key={pricePoint}
            label={PRICE_LABELS[pricePoint]}
            onClick={() => answer({ pricePoint })}
          />
        ))}
      </div>
      <button onClick={dismiss} className="mt-2.5 text-xs text-gray-400 hover:text-gray-600">
        Not interested
      </button>
      <p className="text-[10px] text-gray-400 mt-2">Just research — nothing to buy today.</p>
    </ProbeCard>
  );
}
