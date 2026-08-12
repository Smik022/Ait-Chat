"use client";

import * as React from "react";
import { AlertTriangle, Check, FileText, Play, Plus, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { knowledgeDocs, retrievalDemo } from "@/lib/data";
import {
  Chip,
  Metric,
  MetricRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

const statusMeta = {
  indexed: { label: "Ready", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  syncing: { label: "Reading", tone: "bg-pend-soft text-pend-ink", dot: "bg-pend" },
  failed: { label: "Failed", tone: "bg-block-soft text-block-ink", dot: "bg-block" },
} as const;

/* ----------------------------- Retrieval demo ---------------------------- */

function RetrievalDemo() {
  const total = retrievalDemo.stages.length;
  const [stage, setStage] = React.useState(-1);

  React.useEffect(() => {
    if (stage < 0 || stage >= total) return;
    const id = window.setTimeout(() => setStage((s) => s + 1), 480);
    return () => window.clearTimeout(id);
  }, [stage, total]);

  const done = stage >= total;

  return (
    <Panel>
      <PanelHeader
        title="Answering a question"
        description="Watch one real question go from Banglish to a cited answer."
        action={
          <div className="flex items-center gap-1.5">
            {stage >= 0 ? (
              <button
                type="button"
                onClick={() => setStage(-1)}
                className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition-colors hover:bg-muted"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setStage(0)}
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-3" />
              Run it
            </button>
          </div>
        }
      />

      <div className="p-4">
        <div className="rounded-md border bg-muted/40 px-3 py-2.5">
          <div className="text-[11px] text-muted-foreground">A customer asked</div>
          <p className="mt-1 text-[15px] font-medium" lang="bn-Latn">
            {retrievalDemo.query}
          </p>
          <p className="mt-0.5 text-[12px] italic text-muted-foreground">
            {retrievalDemo.gloss}
          </p>
        </div>

        <ol className="mt-3 grid gap-1.5 sm:grid-cols-3">
          {retrievalDemo.stages.map((s, i) => {
            const reached = stage > i;
            const active = stage === i;
            return (
              <li
                key={s.name}
                className={cn(
                  "rounded-md border px-2.5 py-2 transition-colors duration-200",
                  reached && "border-live/30 bg-live-soft/40",
                  active && "border-foreground/30 bg-muted"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {reached ? (
                    <Check className="size-3 shrink-0 text-live" strokeWidth={3} />
                  ) : active ? (
                    <StatusDot className="bg-foreground" pulse />
                  ) : (
                    <StatusDot className="bg-muted-foreground/30" />
                  )}
                  <span className="text-[12px] font-medium">{s.name}</span>
                  {reached ? (
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
                      {s.ms}ms
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {s.detail}
                </p>
              </li>
            );
          })}
        </ol>

        {stage >= 1 ? (
          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-medium">What it found</h3>
              <span className="text-[11px] text-muted-foreground">
                Searched by meaning and by exact words
              </span>
            </div>

            <ul className="mt-2 space-y-1.5">
              {retrievalDemo.hits.map((h) => {
                const dropped = done && !h.cited;
                return (
                  <li
                    key={h.id}
                    className={cn(
                      "rounded-md border px-3 py-2 transition-opacity",
                      dropped && "opacity-45",
                      done && h.cited && "border-live/30 bg-live-soft/30"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <FileText className="size-3 shrink-0 text-muted-foreground" />
                      <span className="text-[12px] font-medium">{h.doc}</span>
                      {done ? (
                        <Chip
                          tone={h.cited ? "bg-live-soft text-live-ink" : undefined}
                          className="ml-auto"
                        >
                          {h.cited ? "used" : "not relevant"}
                        </Chip>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {h.snippet}
                    </p>
                  </li>
                );
              })}
            </ul>

            {done ? (
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Searching by meaning alone would have missed the first one, because “COD” is a
                literal string, not a concept, so the exact-word search is what caught it.
                That is why both run.
              </p>
            ) : null}
          </div>
        ) : null}

        {done ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-md border border-live/40 bg-live-soft p-3"
          >
            <div className="text-[11px] font-medium text-live-ink">
              Answered, in the language it was asked in
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed" lang="bn-Latn">
              {retrievalDemo.answer}
            </p>
            <p className="mt-1 text-[12px] italic text-live-ink">
              {retrievalDemo.answerGloss}
            </p>
            <p className="mt-2.5 border-t border-live/20 pt-2 text-[11px] text-live-ink">
              Every claim in that answer traces back to a document. Nothing was invented.
            </p>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

/* ------------------------------- Doc library ----------------------------- */

function Library() {
  return (
    <Panel>
      <PanelHeader
        title="What it can answer from"
        description="Nothing outside this list. If it is not here, the agent says it will check."
        action={
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition-colors hover:bg-muted"
          >
            <Plus className="size-3" />
            Add
          </button>
        }
      />
      <ul className="divide-y">
        {knowledgeDocs.map((d) => {
          const meta = statusMeta[d.status];
          return (
            <li key={d.id} className="px-4 py-2.5">
              <div className="flex items-center gap-3">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{d.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {d.pages} pages · used{" "}
                    <span className="font-mono tabular-nums">
                      {d.usedThisWeek.toLocaleString("en-US")}
                    </span>{" "}
                    times this week
                  </div>
                </div>
                <Chip tone={meta.tone}>
                  <StatusDot className={meta.dot} pulse={d.status === "syncing"} />
                  {meta.label}
                </Chip>
              </div>

              {d.error ? (
                <div className="mt-2 flex items-start gap-2 rounded-md border border-block/30 bg-block-soft px-2.5 py-1.5">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0 text-block" />
                  <p className="text-[11px] text-block-ink">{d.error}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export default function KnowledgePage() {
  const ready = knowledgeDocs.filter((d) => d.status === "indexed").length;
  const citations = knowledgeDocs.reduce((n, d) => n + d.usedThisWeek, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge"
        description="The documents your agents answer policy questions from. Order status and stock never come from here. Those are read live from the store, so an answer cannot go stale."
      />

      <MetricRow>
        <Metric label="Documents" value={knowledgeDocs.length} basis={`${ready} ready, 1 needs attention`} />
        <Metric
          label="Answers grounded this week"
          value={citations.toLocaleString("en-US")}
          basis="each one carries a citation"
        />
        <Metric label="Typical lookup" value="387ms" basis="question to cited answer" />
        <Metric label="Invented answers" value="0" basis="no source, no claim" />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <RetrievalDemo />
        <Library />
      </div>
    </div>
  );
}
