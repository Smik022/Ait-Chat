"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gauge,
  Inbox,
  MessageSquareQuote,
  Play,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  agents,
  benchmarkFor,
  formatBDT,
  formatBDTScale,
  integrations,
  revenueSeries,
} from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/live";
import { LogoMark } from "@/components/logo";
import { BrandMark, GoogleMark } from "@/components/brand-logos";
import { ThemeToggle } from "@/components/theme-toggle";
import { Chip, Mono, StatusDot } from "@/components/primitives";

const banglishBenchmark = benchmarkFor("Banglish sentiment accuracy");

/** Every sign-up control here is a placeholder, and says so when you press it. */
const placeholderNotice = () =>
  toast("This is a demonstration", {
    description: "No account is created and no email is sent anywhere.",
  });

/* ------------------------------ What it saves ----------------------------- */

const SAVINGS = [
  {
    label: "Comments on the last post",
    before: "86, one by one",
    after: "all answered",
    note: "You typed none of them.",
  },
  {
    label: "Your evening in the inbox",
    before: "about 4 hours",
    after: "22 minutes",
    note: "You review and approve. You stop typing.",
  },
  {
    label: "How long someone waits",
    before: "40 minutes",
    after: "1.1 seconds",
    note: "Including 2am, when you are asleep.",
  },
  {
    label: "Decisions still yours",
    before: "every single one",
    after: "2 today",
    note: "Only what your rules held back for you.",
  },
];

function WhatItSaves() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">What it takes off your plate</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          One shop, one busy evening.
        </p>
      </div>

      <ul className="divide-y">
        {SAVINGS.map((s) => (
          <li key={s.label} className="px-4 py-3">
            <div className="text-[11px] font-medium text-muted-foreground">
              {s.label}
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <span className="text-[13px] text-muted-foreground line-through decoration-muted-foreground/40">
                {s.before}
              </span>
              <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
              <span className="text-base font-semibold tracking-tight">{s.after}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.note}</p>
          </li>
        ))}
      </ul>

      <div className="border-t bg-muted/40 px-4 py-2.5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          A demonstration scenario, not a measured result.
        </p>
      </div>
    </div>
  );
}

/* -------------------------- Drifting channel marks ------------------------ */

/**
 * The backdrop is made of the product's own material: the messages this thing
 * actually reads all day, the channels they arrive on, and the orders they turn
 * into. Deliberately mixed shapes so it never reads as a tiled pattern.
 */
type Floater = {
  x: string;
  y: string;
  tilt: number;
  dur: number;
  delay: number;
} & (
  | {
      kind: "logo";
      brand: "instagram" | "whatsapp" | "messenger";
      size: number;
      /** Big marks sit behind live text, so they run fainter than the edge ones. */
      dim?: number;
    }
  | { kind: "pill"; text: string }
  | { kind: "price"; text: string }
  | { kind: "note"; text: string }
);

const HERO_FLOATERS: Floater[] = [
  // Large and very faint, sitting behind the copy so the middle is not bare.
  { kind: "logo", brand: "messenger", x: "24%", y: "1%", size: 132, dim: 0.055, tilt: -10, dur: 16, delay: 0 },
  { kind: "logo", brand: "instagram", x: "53%", y: "10%", size: 116, dim: 0.05, tilt: 7, dur: 18, delay: 2.3 },
  { kind: "logo", brand: "whatsapp", x: "57%", y: "52%", size: 104, dim: 0.055, tilt: -6, dur: 15, delay: 1.2 },
  { kind: "logo", brand: "instagram", x: "34%", y: "62%", size: 96, dim: 0.045, tilt: 9, dur: 17, delay: 3.1 },

  // Edge marks, larger than before.
  { kind: "logo", brand: "instagram", x: "0.5%", y: "10%", size: 72, tilt: -8, dur: 12, delay: 0 },
  { kind: "pill", text: "how much?", x: "4%", y: "27%", tilt: -3, dur: 10, delay: 1.1 },
  { kind: "logo", brand: "whatsapp", x: "7%", y: "43%", size: 54, tilt: 6, dur: 9.5, delay: 2.2 },
  { kind: "pill", text: "do you have this?", x: "1.5%", y: "58%", tilt: 4, dur: 13, delay: 0.4 },
  { kind: "price", text: "৳1,290", x: "7%", y: "72%", tilt: -6, dur: 11, delay: 1.7 },
  { kind: "logo", brand: "messenger", x: "1.5%", y: "86%", size: 62, tilt: -4, dur: 13.5, delay: 0.9 },

  { kind: "logo", brand: "whatsapp", x: "92%", y: "7%", size: 68, tilt: 9, dur: 11, delay: 0.6 },
  { kind: "pill", text: "size M available?", x: "84%", y: "24%", tilt: 5, dur: 12.5, delay: 1.9 },
  { kind: "note", text: "order paid", x: "91%", y: "39%", tilt: -4, dur: 10.5, delay: 0.3 },
  { kind: "pill", text: "is it in stock?", x: "87%", y: "55%", tilt: 3, dur: 14, delay: 2.4 },
  { kind: "logo", brand: "instagram", x: "94%", y: "69%", size: 50, tilt: -7, dur: 10, delay: 1.3 },
  { kind: "pill", text: "cash on delivery?", x: "84%", y: "84%", tilt: 6, dur: 12, delay: 0.8 },
];

const START_FLOATERS: Floater[] = [
  { kind: "logo", brand: "instagram", x: "30%", y: "8%", size: 118, dim: 0.05, tilt: -9, dur: 16, delay: 0.4 },
  { kind: "logo", brand: "messenger", x: "58%", y: "44%", size: 102, dim: 0.05, tilt: 8, dur: 17.5, delay: 2.2 },

  { kind: "pill", text: "what's the price?", x: "2%", y: "22%", tilt: -5, dur: 12, delay: 0 },
  { kind: "logo", brand: "whatsapp", x: "8%", y: "48%", size: 58, tilt: 7, dur: 10.5, delay: 1.6 },
  { kind: "price", text: "৳2,190", x: "4%", y: "74%", tilt: 4, dur: 13, delay: 0.7 },
  { kind: "logo", brand: "instagram", x: "91%", y: "16%", size: 56, tilt: 8, dur: 11, delay: 1.2 },
  { kind: "pill", text: "when will it arrive?", x: "83%", y: "46%", tilt: -4, dur: 12.5, delay: 2.1 },
  { kind: "logo", brand: "messenger", x: "93%", y: "74%", size: 52, tilt: 5, dur: 9.5, delay: 0.5 },
];

function FloatingChannels({
  items,
  className,
}: {
  items: Floater[];
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        // Only where there is margin to spare, never over the content on narrow screens.
        "pointer-events-none absolute inset-0 hidden overflow-hidden lg:block",
        className
      )}
    >
      {items.map((f, i) => (
        <span
          key={i}
          className={cn("absolute block", !reduce && "animate-drift")}
          style={
            {
              left: f.x,
              top: f.y,
              "--tilt": `${f.tilt}deg`,
              "--dur": `${f.dur}s`,
              "--delay": `${f.delay}s`,
              transform: `rotate(${f.tilt}deg)`,
            } as React.CSSProperties
          }
        >
          {f.kind === "logo" ? (
            <span
              className={cn("block", f.dim === undefined && "opacity-[0.14] dark:opacity-[0.2]")}
              style={{
                width: f.size,
                height: f.size,
                opacity: f.dim,
              }}
            >
              <BrandMark brand={f.brand} className="size-full" />
            </span>
          ) : f.kind === "pill" ? (
            <span className="block rounded-full rounded-bl-sm border bg-card/70 px-3 py-1.5 text-[13px] whitespace-nowrap text-muted-foreground opacity-45 dark:opacity-40">
              {f.text}
            </span>
          ) : f.kind === "price" ? (
            <span className="block rounded-md border bg-card/70 px-2.5 py-1 font-mono text-[13px] font-medium whitespace-nowrap tabular-nums opacity-40">
              {f.text}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-md border border-live/40 bg-live-soft/60 px-2.5 py-1 text-[12px] whitespace-nowrap text-live-ink opacity-50">
              <Check className="size-3" strokeWidth={3} />
              {f.text}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ========================================================================== */
/*  The product surface: the actual interface, at scale, as the hero.         */
/* ========================================================================== */

const SURFACE_NAV = [
  { label: "Overview", icon: Gauge, active: true },
  { label: "Inbox", icon: Inbox },
  { label: "Comments", icon: MessageSquareQuote },
  { label: "Agents", icon: Users },
  { label: "Guardrails", icon: ShieldCheck },
];

const SURFACE_METRICS = [
  { label: "Conversations today", value: "1,284", delta: "+23%" },
  { label: "Attributed revenue", value: formatBDT(40200), delta: "+34%" },
  { label: "Resolved without a person", value: "87.4%", delta: "+6.8pt" },
  { label: "Waiting on a person", value: "2", delta: null },
];

const SURFACE_ROWS = [
  { time: "10:41:22", action: "Check an order", agent: "AS", outcome: "allowed", detail: "ORD-9316 → shipped · Pathao BD00182909", ms: "380ms" },
  { time: "10:41:05", action: "Look up a product", agent: "AS", outcome: "allowed", detail: "kurti under ৳1,600 → 3 matches", ms: "240ms" },
  { time: "10:40:58", action: "Give a discount", agent: "AS", outcome: "blocked", detail: "15% asked for · your limit is 10% · sent to you", ms: "8ms" },
  { time: "10:40:41", action: "Send a checkout link", agent: "AS", outcome: "allowed", detail: "৳3,890 · link sent", ms: "640ms" },
  { time: "10:40:30", action: "Refund an order", agent: "MG", outcome: "approved", detail: "ORD-9310 · ৳2,450 · you approved it", ms: "940ms" },
  { time: "10:40:12", action: "Sync stock", agent: "AS", outcome: "allowed", detail: "Silk Dupatta → 40 units back in", ms: "1120ms" },
  { time: "10:39:58", action: "Check an order", agent: "AS", outcome: "fallback", detail: "Courier slow · sent what we knew, flagged it", ms: "3210ms" },
];

const outcomeTone: Record<string, string> = {
  allowed: "bg-live-soft text-live-ink",
  blocked: "bg-block-soft text-block-ink",
  approved: "bg-machine-soft text-machine-ink",
  fallback: "bg-pend-soft text-pend-ink",
};

/** Activity that lands while you are looking at the page. */
const INCOMING_ROWS = [
  { time: "10:41:38", action: "Check stock", agent: "AS", outcome: "allowed", detail: "Chaya Cotton Kurti · 42 left", ms: "290ms" },
  { time: "10:41:52", action: "Read what they want", agent: "AS", outcome: "allowed", detail: "price question · Banglish · 0.94", ms: "170ms" },
  { time: "10:42:07", action: "Give a discount", agent: "AS", outcome: "blocked", detail: "12% asked for · your limit is 10% · sent to you", ms: "7ms" },
  { time: "10:42:19", action: "Send a checkout link", agent: "AS", outcome: "allowed", detail: "৳1,290 · link sent", ms: "610ms" },
  { time: "10:42:34", action: "Hand over to a person", agent: "MG", outcome: "allowed", detail: "customer asked for a human · Ayesha took it", ms: "190ms" },
];

function ProductSurface() {
  const reduce = usePrefersReducedMotion();
  const [arrived, setArrived] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setArrived((n) => (n + 1) % (INCOMING_ROWS.length + 1)),
      2800
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const rows = [...INCOMING_ROWS.slice(0, arrived).reverse(), ...SURFACE_ROWS].slice(0, 7);

  return (
    <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/5">
      {/* app chrome */}
      <div className="flex h-9 items-center gap-2 border-b bg-muted/40 px-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </div>
        <div className="mx-auto flex h-5 items-center gap-1.5 rounded border bg-background px-2 text-[10px] text-muted-foreground">
          <Search className="size-2.5" />
          ait-chat.app/admin
        </div>
      </div>

      <div className="flex min-h-[26rem]">
        {/* sidebar */}
        <div className="hidden w-[168px] shrink-0 flex-col border-r bg-sidebar sm:flex">
          <div className="flex h-11 items-center gap-2 border-b px-3">
            <LogoMark className="size-5 rounded" />
            <span className="text-[11px] font-semibold tracking-tight">Ait-Chat</span>
          </div>
          <div className="border-b p-2">
            <div className="flex items-center gap-2 rounded p-1.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-foreground text-[8px] font-semibold text-background">
                AT
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[10px] font-medium">Athelier</span>
                <span className="block truncate text-[9px] text-muted-foreground">
                  Women&rsquo;s wear
                </span>
              </span>
            </div>
          </div>
          <nav className="space-y-0.5 p-2">
            {SURFACE_NAV.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1.5 text-[11px]",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-3" />
                {label}
              </div>
            ))}
          </nav>
        </div>

        {/* main */}
        <div className="min-w-0 flex-1">
          <div className="flex h-11 items-center gap-2 border-b px-3">
            <div className="flex h-6 items-center gap-1.5 rounded border px-2 text-[10px] text-muted-foreground">
              <Search className="size-2.5" />
              Search
            </div>
            <div className="ml-auto flex h-6 items-center gap-1.5 rounded border px-2 text-[10px] font-medium">
              <StatusDot className="bg-live" pulse />
              Live
              <span className="font-mono text-muted-foreground">5,342</span>
            </div>
          </div>

          <div className="space-y-3 p-3">
            {/* metrics */}
            <div className="grid grid-cols-2 divide-y rounded-lg border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {SURFACE_METRICS.map((m) => (
                <div key={m.label} className="p-2.5">
                  <div className="truncate text-[9px] text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="mt-1.5 text-base font-semibold tracking-tight tabular-nums">
                    {m.value}
                  </div>
                  {m.delta ? (
                    <div className="mt-0.5 text-[9px] font-medium text-live-ink tabular-nums">
                      {m.delta}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* the gateway table, the thing worth seeing */}
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div>
                  <div className="text-[11px] font-semibold">What the agents did</div>
                  <div className="text-[9px] text-muted-foreground">
                    Every action they wanted to take, and whether your rules allowed it.
                  </div>
                </div>
                <Mono className="text-[9px] text-muted-foreground">live</Mono>
              </div>
              <table className="w-full text-left">
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.time}
                      className={cn(
                        "border-b last:border-0",
                        r.outcome === "blocked" && "bg-block-soft/40",
                        i === 0 && arrived > 0 && "animate-row-in"
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-[9px] text-muted-foreground tabular-nums">
                        {r.time}
                      </td>
                      <td className="py-1.5 pr-2 text-[10px] font-medium">
                        {r.action}
                      </td>
                      <td className="py-1.5 pr-2">
                        <span className="inline-flex size-3.5 items-center justify-center rounded-sm bg-muted font-mono text-[7px] font-medium">
                          {r.agent}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2">
                        <span
                          className={cn(
                            "inline-flex h-4 items-center gap-1 rounded px-1.5 text-[9px] font-medium",
                            outcomeTone[r.outcome]
                          )}
                        >
                          {r.outcome}
                        </span>
                      </td>
                      <td className="hidden max-w-[16rem] truncate py-1.5 pr-2 text-[10px] text-muted-foreground lg:table-cell">
                        {r.detail}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-[9px] text-muted-foreground tabular-nums">
                        {r.ms}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  Comment → order, shown rather than described                              */
/* ========================================================================== */

const FLOW = [
  { key: "comment", label: "Public comment" },
  { key: "classify", label: "Classified" },
  { key: "reply", label: "One DM sent" },
  { key: "order", label: "Order paid" },
];

function CommentToOrder() {
  const reduce = usePrefersReducedMotion();
  const [cycled, setCycled] = React.useState(0);
  const step = reduce ? FLOW.length - 1 : cycled;

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setCycled((s) => (s + 1) % FLOW.length),
      2400
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* 1 */}
      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-opacity duration-300",
          step >= 0 ? "opacity-100" : "opacity-40"
        )}
      >
        <div className="flex items-center gap-2">
          <BrandMark brand="instagram" className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Comment on a reel
          </span>
        </div>
        <div className="mt-4 flex gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-medium">
            FK
          </span>
          <div className="min-w-0">
            <div className="text-xs font-medium">Farhan Kabir</div>
            <p className="mt-1 text-[15px] leading-snug" lang="bn-Latn">
              Kemon dam? 👀
            </p>
            <p className="mt-0.5 text-xs italic text-muted-foreground">
              What&rsquo;s the price?
            </p>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-opacity duration-300",
          step >= 1 ? "opacity-100" : "opacity-40"
        )}
      >
        <div className="text-xs font-medium text-muted-foreground">
          Assistant reads it
        </div>
        <dl className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Intent</dt>
            <dd className="font-medium">price-inquiry</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Language</dt>
            <dd className="font-medium">Banglish</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Confidence</dt>
            <dd className="font-mono font-medium tabular-nums">0.97</dd>
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-2.5">
            <dt className="text-muted-foreground">Handled by</dt>
            <dd className="font-medium">Assistant</dd>
          </div>
        </dl>
      </div>

      {/* 3 */}
      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-opacity duration-300",
          step >= 2 ? "opacity-100" : "opacity-40"
        )}
      >
        <div className="flex items-center gap-2">
          <Send className="size-3.5 text-live" />
          <span className="text-xs font-medium text-muted-foreground">
            One private reply
          </span>
        </div>
        <p className="mt-4 text-[15px] leading-snug" lang="bn-Latn">
          Farhan bhai, Chaya Cotton Kurti ৳1,290. Regular ৳1,650 theke kome.
        </p>
        <Chip tone="bg-live-soft text-live-ink" className="mt-3">
          1 of 1 allowed
        </Chip>
      </div>

      {/* 4 */}
      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-opacity duration-300",
          step >= 3 ? "border-live/40 opacity-100" : "opacity-40"
        )}
      >
        <div className="flex items-center gap-2">
          <Check className="size-3.5 text-live" strokeWidth={3} />
          <span className="text-xs font-medium text-muted-foreground">Paid</span>
        </div>
        <div className="mt-4">
          <Mono className="text-sm font-medium">ORD-9311</Mono>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            {formatBDT(3180)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            bKash · handed to RedX · Sylhet
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */

export default function Home() {
  const connected = integrations.filter((i) => i.status === "connected");
  const total = revenueSeries.reduce((a, d) => a + d.revenue, 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="size-7 rounded-md" />
            <span className="text-[15px] font-semibold tracking-tight">Ait-Chat</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#product" className="transition-colors hover:text-foreground">
              Product
            </a>
            <a href="#guardrails" className="transition-colors hover:text-foreground">
              Guardrails
            </a>
            <a href="#language" className="transition-colors hover:text-foreground">
              Language
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={placeholderNotice}
              className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Sign in
            </button>
            <Link
              href="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open the demo
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------------------- Hero ---------------------------- */}
        <section className="relative overflow-hidden border-b">
          <FloatingChannels items={HERO_FLOATERS} className="h-[46rem]" />
          <div className="relative mx-auto max-w-[1180px] px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_minmax(0,25rem)] lg:gap-14">
              <div>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                  Your comments are already sales conversations.
                  <span className="text-muted-foreground"> Staff them.</span>
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
                  One AI assistant that answers every comment and DM across Instagram,
                  Messenger and WhatsApp. It quotes real stock, takes the order, and
                  stops dead when it should not decide alone.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={placeholderNotice}
                    className="inline-flex h-11 items-center gap-2.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <span className="flex size-5 items-center justify-center rounded-sm bg-white">
                      <GoogleMark className="size-3.5" />
                    </span>
                    Continue with Google
                  </button>
                  <Link
                    href="/admin"
                    className="inline-flex h-11 items-center gap-2 rounded-md border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Play className="size-3.5" />
                    See it working
                  </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Free to start, no card needed. Connect Instagram in about two minutes.
                </p>
              </div>

              <WhatItSaves />
            </div>

            {/* the product itself, large */}
            <div className="mt-14 sm:mt-16">
              <ProductSurface />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                The actual interface. Every conversation, order and figure in it is a
                demonstration scenario. No channel or store is connected in this build.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------- Product --------------------------- */}
        <section id="product" className="border-b">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Four steps between a comment and a paid order. Most tools do one.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Comment-to-DM tools fire a pre-written reply and stop. Helpdesks pick the
                thread up much later, if at all. The sale happens in the gap.
              </p>
            </div>

            <div className="mt-12">
              <CommentToOrder />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6">
              {FLOW.map((f, i) => (
                <div key={f.key} className="flex items-center gap-2">
                  <Mono className="text-xs text-muted-foreground">
                    0{i + 1}
                  </Mono>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------- Guardrails ------------------------- */}
        <section id="guardrails" className="border-b bg-muted/30">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_minmax(0,30rem)]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                The interesting part is what it is not allowed to do.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                The model never holds a database connection and never writes anything
                directly. It proposes a structured call, and a deterministic policy layer
                decides whether that call runs.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Over the discount ceiling, outside a messaging window, or outside the
                agent&rsquo;s role, it stops. The refusal is recorded next to everything
                that passed.
              </p>
              <Link
                href="/admin/guardrails"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-md border bg-card px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Run one yourself
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-medium">
                  The assistant wants to give a discount
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Chaya Cotton Kurti · customer pushed back on price
                </div>
              </div>
              <div className="border-b bg-muted/40 px-4 py-3">
                <p className="text-[13px] leading-relaxed">
                  <span className="text-muted-foreground">It wants to take </span>
                  <span className="font-semibold">15% off</span>
                  <span className="text-muted-foreground"> an unpaid order.</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your rule says anything over 10% comes to you.
                </p>
              </div>
              <ul className="divide-y">
                {[
                  { label: "Is this a real action?", detail: "yes", ok: true },
                  { label: "Is the assistant allowed to do it?", detail: "yes", ok: true },
                  { label: "Is it within your limits?", detail: "no, 15% is over 10%", ok: false },
                ].map((s) => (
                  <li
                    key={s.label}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5",
                      !s.ok && "bg-block-soft"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full",
                        s.ok ? "bg-live text-background" : "bg-block text-background"
                      )}
                    >
                      {s.ok ? (
                        <Check className="size-2.5" strokeWidth={4} />
                      ) : (
                        <X className="size-2.5" strokeWidth={4} />
                      )}
                    </span>
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="ml-auto truncate text-xs text-muted-foreground">
                      {s.detail}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t bg-block-soft px-4 py-3">
                <div className="text-sm font-medium text-block-ink">
                  Stopped, and sent to you
                </div>
                <p className="mt-1 text-xs leading-relaxed text-block-ink">
                  The discount never happened. It is waiting for your answer, and
                  the attempt is on the record either way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- Language -------------------------- */}
        <section id="language" className="border-b">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_minmax(0,28rem)]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Customers do not write in one language.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Most messages arrive as Banglish: Bangla in Roman letters, mixed with
                English, spelled however the customer felt like spelling it. The same
                person writes <Mono className="text-base">ache</Mono> and{" "}
                <Mono className="text-base">ase</Mono> in one thread.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Ait-Chat classifies it directly rather than translating first, and answers
                in whatever the customer used.
              </p>
              <p className="mt-6 max-w-lg border-t pt-5 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Industry benchmark.</span>{" "}
                Published accuracy on Banglish sentiment tops out around{" "}
                {banglishBenchmark.range}, so confidence rides on every classification and
                a low score routes to a person rather than a guess.{" "}
                <span className="text-muted-foreground/75">
                  Source: {banglishBenchmark.source}.
                </span>
              </p>
            </div>

            <div className="space-y-3">
              {[
                { from: "customer", text: "Amar order ta kothay? 3 din hoye gelo", gloss: "Where is my order? It's been 3 days" },
                { from: "agent", text: "ORD-9317 ta Pathao te ache, tracking BD00182917. 14 August er moddhe pouchhe jabe.", gloss: "ORD-9317 is with Pathao, tracking BD00182917. It will arrive by 14 August." },
                { from: "customer", text: "ধন্যবাদ", gloss: "Thank you", script: true },
              ].map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-4 py-3",
                    m.from === "customer" ? "bg-muted" : "border bg-card"
                  )}
                >
                  {m.from === "agent" ? (
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <StatusDot className="bg-machine" />
                      Assistant
                    </div>
                  ) : null}
                  <p
                    className="text-[15px] leading-relaxed"
                    lang={m.script ? "bn" : "bn-Latn"}
                    data-script={m.script ? "bengali" : undefined}
                  >
                    {m.text}
                  </p>
                  <p className="mt-1 text-xs italic text-muted-foreground">{m.gloss}</p>
                </div>
              ))}
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                Bengali script, Romanised Bangla and English side by side. And that order
                status is fetched from the courier, not remembered.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------- Stack ---------------------------- */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold tracking-tight">
                  You do not need a shop to run a shop
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  No website, no Shopify, no store software. If you have a page and a
                  phone number, that is enough. Your products live here, and so does
                  everything the agents need to know.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {connected.map((i) => (
                  <span
                    key={i.id}
                    className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
                  >
                    <BrandMark brand={i.brand} className="size-4 text-muted-foreground" />
                    {i.name}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-10 sm:grid-cols-4">
              {[
                { k: "Channels", v: "4", n: "Instagram, Messenger, WhatsApp, web" },
                { k: "Agents", v: String(agents.length), n: "one assistant, one approver" },
                { k: "Languages", v: "3", n: "Banglish, Bangla, English" },
                { k: "Attributed in 8 days", v: formatBDTScale(total), n: "illustrative" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-sm text-muted-foreground">{s.k}</dt>
                  <dd className="mt-1.5 font-mono text-3xl font-semibold tracking-tight tabular-nums">
                    {s.v}
                  </dd>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------- Close ---------------------------- */}
        <section className="relative overflow-hidden">
          <FloatingChannels items={START_FLOATERS} />
          <div className="relative mx-auto max-w-[1180px] px-5 py-24 text-center sm:px-8">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Start with tonight&rsquo;s comments.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
              Connect one channel, write one rule, and let it answer while you sleep.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={placeholderNotice}
                className="inline-flex h-11 items-center gap-2.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="flex size-5 items-center justify-center rounded-sm bg-white">
                  <GoogleMark className="size-3.5" />
                </span>
                Continue with Google
              </button>
              <Link
                href="/admin"
                className="inline-flex h-11 items-center gap-2 rounded-md border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Open the demo
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Placeholder. This demonstration does not create accounts, and nothing is
              sent anywhere.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-6 rounded" />
            <span className="text-sm font-medium">Ait-Chat</span>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            A working prototype. Every merchant, customer, conversation, order and figure
            shown here is illustrative. There are no live integrations and no customer
            data. Figures credited as industry benchmarks come from published 2026
            research, not from this product.
          </p>
        </div>
      </footer>
    </div>
  );
}
