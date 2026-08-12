"use client";

import * as React from "react";
import { AlertTriangle, Plus } from "lucide-react";

import { integrations, type Integration } from "@/lib/data";
import { BrandMark } from "@/components/brand-logos";
import {
  Chip,
  Metric,
  MetricRow,
  Mono,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

const GROUPS: { kind: Integration["kind"]; title: string; description: string }[] = [
  {
    kind: "channel",
    title: "Channels",
    description: "Where customers actually talk to this business.",
  },
  {
    kind: "commerce",
    title: "Storefront",
    description: "The source of truth for catalogue, stock and orders.",
  },
  {
    kind: "logistics",
    title: "Couriers",
    description: "Live tracking, read at the moment a customer asks.",
  },
  {
    kind: "crm",
    title: "CRM",
    description: "Where conversation context is written back.",
  },
];

const statusMeta = {
  connected: { label: "Connected", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  attention: { label: "Needs attention", tone: "bg-pend-soft text-pend-ink", dot: "bg-pend" },
  available: { label: "Not connected", tone: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
} as const;

function IntegrationRow({ item }: { item: Integration }) {
  const meta = statusMeta[item.status];
  const [open, setOpen] = React.useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded border bg-card">
          <BrandMark brand={item.brand} className="size-4 text-foreground" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-[13px] font-medium">{item.name}</span>
            <Chip tone={meta.tone}>
              <StatusDot className={meta.dot} pulse={item.status === "attention"} />
              {meta.label}
            </Chip>
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
            {item.description}
          </span>
        </span>

        <span className="hidden shrink-0 text-right sm:block">
          <span className="block font-mono text-[11px] text-muted-foreground">
            {item.account}
          </span>
          {item.lastEvent ? (
            <span className="block text-[10px] text-muted-foreground">
              {item.lastEvent}
            </span>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="border-t bg-muted/25 px-4 py-3">
          {item.note ? (
            <div className="mb-3 flex items-start gap-2 rounded-md border border-pend/30 bg-pend-soft px-2.5 py-1.5">
              <AlertTriangle className="mt-0.5 size-3 shrink-0 text-pend" />
              <p className="text-[11px] text-pend-ink">{item.note}</p>
            </div>
          ) : null}

          {item.scopes.length ? (
            <>
              <h4 className="text-[11px] font-medium text-muted-foreground">
                Permissions granted
              </h4>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.scopes.map((s) => (
                  <Mono
                    key={s}
                    className="rounded border bg-card px-1.5 py-0.5 text-[11px]"
                  >
                    {s}
                  </Mono>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Least privilege: only what the agents actually need to do their job.
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground">
                Not connected. The adapter is built and ready.
              </p>
              <button
                type="button"
                className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-3" />
                Connect
              </button>
            </div>
          )}
        </div>
      ) : null}
    </li>
  );
}

export default function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === "connected").length;
  const attention = integrations.filter((i) => i.status === "attention").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Integrations"
        description="Every channel and system the agents can reach, and exactly which permissions each one was granted."
      />

      <MetricRow>
        <Metric label="Connected" value={connected} basis={`of ${integrations.length} available`} />
        <Metric label="Channels live" value={3} basis="Instagram, Messenger, WhatsApp" />
        <Metric label="Needs attention" value={attention} basis="courier over latency budget" />
        <Metric label="Webhook events today" value="12,486" basis="ingested and deduplicated" />
      </MetricRow>

      <div className="grid gap-5 lg:grid-cols-2">
        {GROUPS.map((g) => {
          const items = integrations.filter((i) => i.kind === g.kind);
          if (!items.length) return null;
          return (
            <Panel key={g.kind}>
              <PanelHeader title={g.title} description={g.description} />
              <ul className="divide-y">
                {items.map((item) => (
                  <IntegrationRow key={item.id} item={item} />
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <PanelHeader
          title="How the connection works"
          description="The same shape for every provider, which is what makes them swappable."
        />
        <ol className="divide-y">
          {[
            {
              step: "Webhook in",
              body: "Meta, Shopify and the couriers all push events. Each one is verified, deduplicated on its own event ID, and normalised into a single internal shape.",
            },
            {
              step: "Normalise",
              body: "Instagram, Messenger and WhatsApp differ in payload but not in meaning. One adapter each, one canonical message afterwards.",
            },
            {
              step: "Route and act",
              body: "The normalised event enters the agent stack. Anything the agents want to write goes back out through the gateway, never directly.",
            },
            {
              step: "Reconcile",
              body: "Stock and order state are re-read on demand rather than trusted from the last webhook, so a missed event cannot become a wrong answer.",
            },
          ].map((s, i) => (
            <li key={s.step} className="flex gap-3 px-4 py-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[12px] font-medium">{s.step}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
