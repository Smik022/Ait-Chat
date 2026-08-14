"use client";

/**
 * The demo's heartbeat.
 *
 * There is no server here (the site is a static export), so "live" means a
 * deterministic, scripted sequence replayed client-side. Deterministic matters:
 * the same events land in the same order every time the page is opened, so the
 * demo can be walked through repeatedly without surprises.
 *
 * Everything time-dependent is produced after mount so the static HTML and the
 * first client render always agree.
 */

import * as React from "react";
import type { AgentRole, GatewayEvent, Outcome } from "@/lib/data";
import { gatewayLog, kpis } from "@/lib/data";

type ScriptedEvent = {
  tool: string;
  agent: AgentRole;
  outcome: Outcome;
  detail: string;
  latencyMs: number;
  policy?: string;
  conversationId?: string;
  /** Revenue this event attributes, if any. */
  revenue?: number;
  order?: boolean;
};

/**
 * The loop. Ordered so a viewer sees a refusal within the first few seconds.
 * the blocked call is the point of the whole gateway, not an edge case.
 */
const SCRIPT: ScriptedEvent[] = [
  { tool: "classify_intent", agent: "router", outcome: "allowed", detail: "price-inquiry · 0.94 · banglish", latencyMs: 170 },
  { tool: "check_inventory", agent: "sales", outcome: "allowed", detail: "Chaya Cotton Kurti · 42 left", latencyMs: 290 },
  { tool: "apply_discount", agent: "sales", outcome: "blocked", detail: "15% requested · ceiling is 10% · routed to Manager", latencyMs: 7, policy: "P-01" },
  { tool: "search_knowledge_base", agent: "support", outcome: "allowed", detail: "COD return window → 3 chunks · top 0.97", latencyMs: 215 },
  { tool: "create_payment_link", agent: "sales", outcome: "allowed", detail: "Draft order · ৳1,290 · link issued", latencyMs: 620, revenue: 1290, order: true },
  { tool: "get_order_status", agent: "support", outcome: "allowed", detail: "ORD-9317 → shipped · Pathao BD00182917", latencyMs: 360 },
  { tool: "recover_cart", agent: "retention", outcome: "blocked", detail: "24h window closed 4m ago · send suppressed", latencyMs: 5, policy: "P-05" },
  { tool: "approve_discount", agent: "manager", outcome: "approved", detail: "10% approved on draft · within ceiling after review", latencyMs: 880, policy: "P-01" },
  { tool: "detect_language", agent: "router", outcome: "allowed", detail: "bangla · 0.97 · Bengali script", latencyMs: 55 },
  { tool: "check_logistics", agent: "operations", outcome: "fallback", detail: "Steadfast 3.2s · static ETA sent, thread flagged", latencyMs: 3180, policy: "P-06" },
  { tool: "search_products", agent: "sales", outcome: "allowed", detail: "saree · cream → 4 matches", latencyMs: 250 },
  { tool: "create_payment_link", agent: "sales", outcome: "allowed", detail: "Draft order · ৳2,190 · link issued", latencyMs: 590, revenue: 2190, order: true },
  { tool: "handoff_to_human", agent: "manager", outcome: "allowed", detail: "CV-218 → Ayesha Karim · context attached", latencyMs: 195, conversationId: "CV-218" },
  { tool: "score_sentiment", agent: "router", outcome: "allowed", detail: "negative · 0.81 · escalation armed", latencyMs: 130 },
  { tool: "issue_refund", agent: "support", outcome: "blocked", detail: "Support cannot refund. Sent to the Manager.", latencyMs: 9, policy: "P-02" },
  { tool: "sync_inventory", agent: "operations", outcome: "allowed", detail: "P-1410 → 40 units received", latencyMs: 1080 },
];

/** Advances a HH:MM:SS clock string by a number of seconds. */
function advanceClock(base: string, seconds: number) {
  const [h, m, s] = base.split(":").map(Number);
  const total = (h * 3600 + m * 60 + s + seconds) % 86400;
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export interface LiveMetrics {
  conversationsToday: number;
  revenueAttributed: number;
  ordersToday: number;
  containment: number;
  approvalsWaiting: number;
  toolCallsToday: number;
  blockedToday: number;
}

interface LiveContextValue {
  live: boolean;
  setLive: React.Dispatch<React.SetStateAction<boolean>>;
  events: GatewayEvent[];
  newestId: string | null;
  metrics: LiveMetrics;
  /** Ticks up once per emitted event; useful as a cheap re-render key. */
  beat: number;
}

const LiveContext = React.createContext<LiveContextValue | null>(null);

const TICK_MS = 3400;

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [live, setLive] = React.useState(true);
  const [events, setEvents] = React.useState<GatewayEvent[]>(gatewayLog);
  const [newestId, setNewestId] = React.useState<string | null>(null);
  const [beat, setBeat] = React.useState(0);
  const [metrics, setMetrics] = React.useState<LiveMetrics>({
    conversationsToday: kpis.conversationsToday,
    revenueAttributed: kpis.revenueAttributed,
    ordersToday: 33,
    containment: kpis.containment,
    approvalsWaiting: kpis.approvalsWaiting,
    toolCallsToday: 5342,
    blockedToday: 41,
  });

  const cursor = React.useRef(0);
  const clock = React.useRef("10:41:22");

  React.useEffect(() => {
    if (!live) return;

    const id = window.setInterval(() => {
      const step = SCRIPT[cursor.current % SCRIPT.length];
      cursor.current += 1;
      clock.current = advanceClock(clock.current, 3 + (cursor.current % 5));

      const event: GatewayEvent = {
        id: `live-${cursor.current}`,
        time: clock.current,
        tool: step.tool,
        agent: step.agent,
        outcome: step.outcome,
        detail: step.detail,
        latencyMs: step.latencyMs,
        policy: step.policy,
        conversationId: step.conversationId,
      };

      setEvents((prev) => [event, ...prev].slice(0, 60));
      setNewestId(event.id);
      setBeat((b) => b + 1);
      setMetrics((prev) => ({
        conversationsToday: prev.conversationsToday + (cursor.current % 3 === 0 ? 1 : 0),
        revenueAttributed: prev.revenueAttributed + (step.revenue ?? 0),
        ordersToday: prev.ordersToday + (step.order ? 1 : 0),
        // Held inside the published 75-90% band. It used to climb past the top of
        // the benchmark it is measured against, which is not a claim we can make.
        containment: Math.min(
          88,
          Math.max(
            78,
            Number(
              (prev.containment + (step.outcome === "allowed" ? 0.02 : -0.03)).toFixed(2)
            )
          )
        ),
        // Capped. Left running through a long meeting these used to drift far past
        // the lists they claim to summarise, so the Overview would read
        // "waiting on a person: 47" above three rows.
        approvalsWaiting:
          step.outcome === "blocked"
            ? Math.min(4, prev.approvalsWaiting + 1)
            : step.outcome === "approved"
              ? Math.max(1, prev.approvalsWaiting - 1)
              : prev.approvalsWaiting,
        toolCallsToday: prev.toolCallsToday + 1,
        blockedToday: prev.blockedToday + (step.outcome === "blocked" ? 1 : 0),
      }));
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [live]);

  const value = React.useMemo<LiveContextValue>(
    () => ({ live, setLive, events, newestId, metrics, beat }),
    [live, events, newestId, metrics, beat]
  );

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const ctx = React.useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside a LiveProvider.");
  return ctx;
}

/**
 * Counts a number up to its target once, after mount. Used for headline figures
 * so they settle rather than snapping. This is the only decorative motion in the build,
 * and it is disabled outright under reduced-motion.
 */
export function useSettledNumber(target: number, durationMs = 650) {
  const [value, setValue] = React.useState(target);
  const previous = React.useRef(target);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = previous.current;
    previous.current = target;

    if (reduce || from === target) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

const neverChanges = () => () => {};

/** True only after hydration. Guards anything that must not render on the server. */
export function useMounted() {
  return React.useSyncExternalStore(
    neverChanges,
    () => true,
    () => false
  );
}

function subscribeToMotionPreference(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Reads the OS motion preference without an effect, so it is correct on first paint. */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
