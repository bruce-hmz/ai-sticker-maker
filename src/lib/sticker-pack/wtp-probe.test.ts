import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("wtp probe session flags", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("claimProbeView fires exactly once per session, independently per probe", async () => {
    const wtp = await import("./wtp-probe");
    expect(wtp.claimProbeView("use_case")).toBe(true);
    expect(wtp.claimProbeView("use_case")).toBe(false);
    expect(wtp.claimProbeView("use_case")).toBe(false);
    expect(wtp.claimProbeView("pricing_door")).toBe(true);
    expect(wtp.claimProbeView("pricing_door")).toBe(false);
  });

  it("retireProbe suppresses the probe for the rest of the session", async () => {
    const wtp = await import("./wtp-probe");
    expect(wtp.isProbeRetired("pricing_door")).toBe(false);
    wtp.retireProbe("pricing_door");
    expect(wtp.isProbeRetired("pricing_door")).toBe(true);
    expect(wtp.isProbeRetired("use_case")).toBe(false);
  });

  it("answer enums are frozen to the §4 spec (docs/review-2026-09-16.md)", async () => {
    const wtp = await import("./wtp-probe");
    expect([...wtp.USE_CASE_OPTIONS]).toEqual([
      "personal_chat",
      "print_physical",
      "resell",
      "client_work",
      "other",
    ]);
    expect([...wtp.PRICE_POINTS]).toEqual(["free", "1.99", "4.99", "9.99_plus"]);
  });

  it("storage failures never crash the probes (flags are best-effort)", async () => {
    const wtp = await import("./wtp-probe");
    const origGet = sessionStorage.getItem;
    const origSet = sessionStorage.setItem;
    sessionStorage.getItem = vi.fn(() => {
      throw new DOMException("unavailable");
    });
    sessionStorage.setItem = vi.fn(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(wtp.isProbeRetired("use_case")).toBe(false);
    expect(wtp.claimProbeView("use_case")).toBe(true); // claims first view even if the flag can't persist
    expect(() => wtp.retireProbe("use_case")).not.toThrow();
    sessionStorage.getItem = origGet;
    sessionStorage.setItem = origSet;
  });
});

describe("wtp probe analytics events", () => {
  beforeEach(() => {
    (globalThis as { gtag?: unknown }).gtag = undefined;
  });
  afterEach(() => {
    delete (globalThis as { gtag?: unknown }).gtag;
  });

  it("viewed and clicked carry probeType + context and survive the privacy scrub", async () => {
    const { trackPackEvent } = await import("./analytics");
    const calls: unknown[][] = [];
    (globalThis as { gtag?: unknown }).gtag = (...args: unknown[]) => calls.push(args);
    trackPackEvent("wtp_probe_viewed", {
      probeType: "pricing_door",
      completedCount: 6,
      landingPage: "/pet-sticker-maker",
    });
    trackPackEvent("wtp_probe_clicked", {
      probeType: "pricing_door",
      pricePoint: "4.99",
      completedCount: 6,
      landingPage: "/pet-sticker-maker",
    });
    trackPackEvent("wtp_probe_clicked", {
      probeType: "use_case",
      option: "resell",
      completedCount: 3,
      landingPage: "/",
    });
    expect(calls.map((c) => c[1])).toEqual([
      "wtp_probe_viewed",
      "wtp_probe_clicked",
      "wtp_probe_clicked",
    ]);
    expect(calls[0][2]).toEqual({
      probeType: "pricing_door",
      completedCount: 6,
      landingPage: "/pet-sticker-maker",
    });
    expect(calls[1][2]).toMatchObject({ pricePoint: "4.99" });
    expect(calls[2][2]).toMatchObject({ option: "resell" });
  });

  it("event names stay within GA4's 40-character limit", async () => {
    const analytics = await import("./analytics");
    const events: string[] = [];
    const probe = { probeType: "use_case", option: "other" } as never;
    const gtag = (...args: unknown[]) => events.push(args[1] as string);
    (globalThis as { gtag?: unknown }).gtag = gtag;
    analytics.trackPackEvent("wtp_probe_viewed" as never, probe);
    analytics.trackPackEvent("wtp_probe_clicked" as never, probe);
    expect(events.every((e) => e.length <= 40)).toBe(true);
  });
});
