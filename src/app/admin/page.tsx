"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import {
  actionLabel,
  agents,
  benchmarkFor,
  conversations,
  conversationStatusMeta,
  formatBDT,
  formatBDTScale,
  funnel,
  languageMix,
  orders,
  revenueSeries,
} from "@/lib/data";

const banglishBenchmark = benchmarkFor("Banglish sentiment accuracy");
import { useLive, useMounted, useSettledNumber } from "@/lib/live";
import {
  AgentBadge,
  BenchmarkNote,
  ChannelBadge,
  Chip,
  Metric,
  MetricRow,
  Mono,
  OutcomeChip,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: { label: "Attributed revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

function LiveActivity() {
  const { events, newestId, live } = useLive();
  const mounted = useMounted();

  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader
        title="What the agents did"
        description="Every action they wanted to take, and whether your rules allowed it."
        action={
          <Link
            href="/admin/guardrails"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Open
            <ArrowRight className="size-3" />
          </Link>
        }
      />
      <ul className="max-h-[26rem] overflow-auto">
        {events.slice(0, 14).map((e) => (
          <li
            key={e.id}
            className={cn(
              "border-b px-4 py-2.5 last:border-0",
              mounted && live && e.id === newestId && "animate-row-in"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
                {e.time}
              </span>
              <span className="truncate text-[13px] font-medium">
                {actionLabel(e.tool)}
              </span>
              <span className="ml-auto shrink-0">
                <OutcomeChip outcome={e.outcome} />
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 pl-[2.85rem]">
              <AgentBadge agent={e.agent} />
              <span className="min-w-0 truncate text-[11px] text-muted-foreground">
                {e.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function Workforce() {
  return (
    <Panel>
      <PanelHeader
        title="Agent workforce"
        description="Who is handling what right now."
        action={
          <Link
            href="/admin/agents"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Open
            <ArrowRight className="size-3" />
          </Link>
        }
      />
      <ul className="divide-y">
        {agents.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] font-medium">
              {a.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{a.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {a.title}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2.5">
              {a.handlesNow > 0 ? (
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {a.handlesNow}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StatusDot
                  className={
                    a.status === "online"
                      ? "bg-live"
                      : a.status === "busy"
                        ? "bg-pend"
                        : "bg-muted-foreground"
                  }
                  pulse={a.status === "busy"}
                />
                {a.status}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function NeedsAPerson() {
  const waiting = conversations.filter(
    (c) => c.status === "awaiting-approval" || c.status === "with-human"
  );
  const refund = orders.find((o) => o.status === "return-requested");

  return (
    <Panel>
      <PanelHeader
        title="Needs a person"
        description="Held at the gateway until someone decides."
      />
      <ul className="divide-y">
        {waiting.map((c) => (
          <li key={c.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13px] font-medium">
                    {c.customer}
                  </span>
                  <ChannelBadge channel={c.channel} withLabel={false} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.intent}</p>
              </div>
              <Chip tone={conversationStatusMeta[c.status].tone}>
                {conversationStatusMeta[c.status].label}
              </Chip>
            </div>
            <Link
              href={`/admin/inbox?thread=${c.id}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              Review thread
              <ArrowUpRight className="size-3" />
            </Link>
          </li>
        ))}
        {refund ? (
          <li className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Mono className="text-[12px] font-medium">{refund.id}</Mono>
                  <Chip tone="bg-pend-soft text-pend-ink">Refund review</Chip>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBDT(refund.amount)} · {refund.customer} · under the ৳3,000
                  ceiling, outside the Assistant&rsquo;s scope
                </p>
              </div>
            </div>
            <Link
              href={`/admin/orders?order=${refund.id}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              Open order
              <ArrowUpRight className="size-3" />
            </Link>
          </li>
        ) : null}
      </ul>
    </Panel>
  );
}

function Funnel() {
  const top = funnel[0].value;
  return (
    <Panel>
      <PanelHeader
        title="Comment to order"
        description="The last post, followed all the way through."
        action={
          <Link
            href="/admin/comments"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Open
            <ArrowRight className="size-3" />
          </Link>
        }
      />
      <ul className="divide-y">
        {funnel.map((s, i) => {
          const pct = Math.round((s.value / top) * 100);
          const drop =
            i === 0 ? null : Math.round((s.value / funnel[i - 1].value) * 100);
          return (
            <li key={s.stage} className="px-4 py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium">{s.stage}</span>
                <span className="flex items-baseline gap-2">
                  {drop !== null ? (
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {drop}%
                    </span>
                  ) : null}
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {s.value}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-live"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-36 shrink-0 truncate text-[11px] text-muted-foreground">
                  {s.note}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function RevenueChart() {
  return (
    <Panel>
      <PanelHeader
        title="Attributed revenue"
        description="Orders whose conversation began in a social channel."
        action={
          <span className="font-mono text-sm font-medium tabular-nums">
            {formatBDTScale(revenueSeries.reduce((a, d) => a + d.revenue, 0))}
          </span>
        }
      />
      <div className="p-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={revenueSeries} margin={{ left: 4, right: 4, top: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              fontSize={11}
              tickFormatter={(v) => `${Number(v) / 1000}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatBDT(Number(value))}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </Panel>
  );
}

function LanguageSplit() {
  return (
    <Panel>
      <PanelHeader
        title="Language of inbound messages"
        description="What customers actually write in."
      />
      <div className="space-y-3 p-4">
        {languageMix.map((l) => (
          <div key={l.name}>
            <div className="flex items-baseline justify-between text-[13px]">
              <span>{l.name}</span>
              <span className="font-mono tabular-nums">{l.value}%</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/70"
                style={{ width: `${l.value}%` }}
              />
            </div>
          </div>
        ))}
        <div className="border-t pt-3">
          <BenchmarkNote source={banglishBenchmark.source}>
            Published {banglishBenchmark.label.toLowerCase()} tops out at{" "}
            {banglishBenchmark.range}, so low-confidence classifications route to a
            person rather than guess.
          </BenchmarkNote>
        </div>
      </div>
    </Panel>
  );
}

export default function OverviewPage() {
  const { metrics } = useLive();
  const mounted = useMounted();
  const revenue = useSettledNumber(metrics.revenueAttributed);
  const conversationCount = useSettledNumber(metrics.conversationsToday);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Overview"
        description="Everything the agent workforce is doing right now, and everything it was not allowed to do."
        actions={
          <>
            <span className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs text-muted-foreground">
              Last 8 days
            </span>
            <Link
              href="/admin/comments"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Watch a comment convert
              <ArrowRight className="size-3.5" />
            </Link>
          </>
        }
      />

      <MetricRow>
        <Metric
          label="Conversations today"
          value={mounted ? conversationCount.toLocaleString("en-US") : "1,284"}
          trend={{ direction: "up", amount: "23%" }}
          basis="vs. 7-day average"
        />
        <Metric
          label="Attributed revenue"
          value={formatBDT(mounted ? revenue : metrics.revenueAttributed)}
          trend={{ direction: "up", amount: "34%" }}
          basis="vs. 7-day average"
        />
        <Metric
          label="Resolved without a person"
          value={`${metrics.containment.toFixed(1)}%`}
          trend={{ direction: "up", amount: "6.8pt" }}
          basis={`${metrics.blockedToday} calls blocked today`}
        />
        <Metric
          label="Waiting on a person"
          value={metrics.approvalsWaiting}
          basis="approvals and escalations"
        />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* min-w-0 or the table's min-content width blows the grid track out and
            scrolls the whole document sideways. */}
        <div className="min-w-0 space-y-5">
          <LiveActivity />
          <Funnel />
        </div>
        <div className="space-y-5">
          <Workforce />
          <NeedsAPerson />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <RevenueChart />
        <LanguageSplit />
      </div>
    </div>
  );
}
