"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      const ins = document.querySelector(`ins[data-ad-slot="${slot}"]`);
      if (ins && ins.getAttribute("data-adsbygoogle-status")) return;
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      /* AdSense not loaded */
    }
  }, [slot]);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!clientId || !slot) return null;

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
