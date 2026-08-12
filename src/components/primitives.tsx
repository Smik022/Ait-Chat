import * as React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand-logos";
import {
  agentById,
  channelMeta,
  languageMeta,
  outcomeMeta,
  type AgentRole,
  type Channel,
  type Language,
  type Outcome,
} from "@/lib/data";

/* --------------------------------- Panel --------------------------------- */

export function Panel({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-lg border bg-card", className)}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b px-4 py-3",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* --------------------------------- Chips --------------------------------- */

export function Chip({
  className,
  tone,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded px-1.5 text-[11px] font-medium whitespace-nowrap",
        tone ?? "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  className,
  pulse = false,
}: {
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        pulse && "animate-pulse-dot",
        className
      )}
    />
  );
}

export function ChannelBadge({
  channel,
  withLabel = true,
  className,
}: {
  channel: Channel;
  withLabel?: boolean;
  className?: string;
}) {
  const meta = channelMeta[channel];
  return (
    <Chip tone={meta.tint} className={className}>
      <BrandMark brand={meta.brand} className="size-3" />
      {withLabel ? meta.label : meta.short}
    </Chip>
  );
}

export function AgentBadge({
  agent,
  className,
}: {
  agent: AgentRole;
  className?: string;
}) {
  const def = agentById(agent);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span className="inline-flex size-4 items-center justify-center rounded-sm bg-muted font-mono text-[9px] font-medium text-foreground/70">
        {def.initials}
      </span>
      {def.name}
    </span>
  );
}

export function LanguageChip({
  language,
  confidence,
  className,
}: {
  language: Language;
  confidence?: number;
  className?: string;
}) {
  return (
    <Chip className={cn("font-mono", className)}>
      {languageMeta[language].short}
      {confidence !== undefined ? (
        <span className="text-muted-foreground/70">{confidence.toFixed(2)}</span>
      ) : null}
    </Chip>
  );
}

export function OutcomeChip({
  outcome,
  className,
}: {
  outcome: Outcome;
  className?: string;
}) {
  const meta = outcomeMeta[outcome];
  return (
    <Chip tone={meta.tone} className={className}>
      <StatusDot className={meta.dot} />
      {meta.label}
    </Chip>
  );
}

/* -------------------------------- Metrics -------------------------------- */

export function Metric({
  label,
  value,
  basis,
  trend,
  emphasis = false,
}: {
  label: string;
  value: React.ReactNode;
  /** What the number is measured against. Never a bare percentage with no referent. */
  basis?: string;
  trend?: { direction: "up" | "down" | "flat"; amount: string };
  emphasis?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-3 p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div>
        <div
          className={cn(
            "font-semibold tracking-tight tabular-nums",
            emphasis ? "text-3xl" : "text-2xl"
          )}
        >
          {value}
        </div>
        {basis || trend ? (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {trend ? (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium tabular-nums",
                  trend.direction === "up" && "text-live-ink",
                  trend.direction === "down" && "text-block-ink",
                  trend.direction === "flat" && "text-muted-foreground"
                )}
              >
                {trend.direction === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : trend.direction === "down" ? (
                  <ArrowDownRight className="size-3" />
                ) : (
                  <ArrowRight className="size-3" />
                )}
                {trend.amount}
              </span>
            ) : null}
            {basis ? (
              <span className="truncate text-muted-foreground">{basis}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function MetricRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 divide-y rounded-lg border bg-card sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4 [&>*:not(:first-child)]:sm:border-l [&>*:nth-child(3)]:sm:border-t [&>*:nth-child(3)]:xl:border-t-0 [&>*:nth-child(4)]:sm:border-t [&>*:nth-child(4)]:xl:border-t-0 [&>*:nth-child(3)]:sm:border-l-0 [&>*:nth-child(3)]:xl:border-l">
      {children}
    </div>
  );
}

/* ------------------------------- Confidence ------------------------------ */

export function ConfidenceBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  const low = value < 0.6;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label ? (
        <span className="text-xs text-muted-foreground">{label}</span>
      ) : null}
      <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", low ? "bg-pend" : "bg-live")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "font-mono text-[11px] tabular-nums",
          low ? "text-pend-ink" : "text-muted-foreground"
        )}
      >
        {value.toFixed(2)}
      </span>
    </div>
  );
}

/* ------------------------------- Empty state ----------------------------- */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* -------------------------------- Page head ------------------------------ */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/**
 * Marks a figure that comes from published industry research rather than from
 * this workspace. Used wherever a benchmark appears so it can never be misread
 * as an achieved result.
 */
export function BenchmarkNote({
  source,
  children,
}: {
  /** Where the figure came from. A benchmark without its provenance is just a claim. */
  source: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-[11px] leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground/70">Industry benchmark.</span>{" "}
      {children}{" "}
      <span className="whitespace-nowrap text-muted-foreground/75">Source: {source}</span>
    </p>
  );
}

/** Mono text for identifiers: order numbers, SKUs, tracking codes, tool names. */
export function Mono({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("font-mono text-[13px] tabular-nums", className)}
      {...props}
    />
  );
}
