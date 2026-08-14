"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  alwaysHumanOptions,
  businessBasicsDefaults,
  courierOptions,
  derivedAnswers,
  knowledgeDocs,
  retrievalDemo,
  type BusinessBasics,
} from "@/lib/data";
import {
  Chip,
  Metric,
  MetricRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusMeta = {
  indexed: { label: "Ready", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  syncing: { label: "Reading", tone: "bg-pend-soft text-pend-ink", dot: "bg-pend" },
  failed: { label: "Failed", tone: "bg-block-soft text-block-ink", dot: "bg-block" },
} as const;

/* ------------------------------ Small inputs ------------------------------ */

const inputCls =
  "h-9 w-full rounded-md border bg-background px-2.5 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[12px] font-medium">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function YesNo({
  value,
  onChange,
  yes = "Yes",
  no = "No",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  yes?: string;
  no?: string;
}) {
  return (
    <div className="inline-flex rounded-md border p-0.5">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={cn(
            "h-8 rounded px-3 text-[13px] font-medium transition-colors",
            value === v
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {v ? yes : no}
        </button>
      ))}
    </div>
  );
}

function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            aria-pressed={on}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[13px] transition-colors",
              on ? "border-foreground bg-foreground text-background" : "hover:bg-muted"
            )}
          >
            {on ? <Check className="size-3" strokeWidth={3} /> : null}
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Wizard --------------------------------- */

const STEPS = ["Your shop", "Delivery", "Payment", "Returns", "People"] as const;

function Setup({
  basics,
  set,
}: {
  basics: BusinessBasics;
  set: (patch: Partial<BusinessBasics>) => void;
}) {
  const [step, setStep] = React.useState(0);
  const last = STEPS.length - 1;

  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader
        title="Tell us how your shop works"
        description="Eight questions your customers ask every day. Answer them once and the agents stop guessing."
        action={
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {step + 1} of {STEPS.length}
          </span>
        }
      />

      <div className="flex gap-1 border-b px-4 py-2.5">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            aria-current={i === step ? "step" : undefined}
            className="group flex flex-1 flex-col gap-1.5 text-left"
          >
            <span
              className={cn(
                "h-1 rounded-full transition-colors",
                i < step ? "bg-live" : i === step ? "bg-foreground" : "bg-muted"
              )}
            />
            <span
              className={cn(
                "truncate text-[11px] transition-colors",
                i === step
                  ? "font-medium text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {s}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-[19rem] space-y-4 p-4">
        {step === 0 ? (
          <>
            <Field
              label="What do you sell?"
              hint="Plain words are fine. This is what the agent says when someone asks."
              htmlFor="sells"
            >
              <input
                id="sells"
                value={basics.sells}
                onChange={(e) => set({ sells: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Do your items come in sizes?" hint="Clothing, shoes, anything fitted.">
              <YesNo value={basics.hasSizes} onChange={(hasSizes) => set({ hasSizes })} />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Delivery inside Dhaka" htmlFor="dc">
                <div className="flex gap-2">
                  <span className="inline-flex h-9 items-center rounded-md border bg-background px-2.5 text-[13px] text-muted-foreground">
                    ৳
                  </span>
                  <input
                    id="dc"
                    type="number"
                    value={basics.dhakaCharge}
                    onChange={(e) => set({ dhakaCharge: Number(e.target.value) })}
                    className={cn(inputCls, "font-mono tabular-nums")}
                  />
                </div>
              </Field>
              <Field label="How long, inside Dhaka" htmlFor="dd">
                <input
                  id="dd"
                  value={basics.dhakaDays}
                  onChange={(e) => set({ dhakaDays: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Delivery outside Dhaka" htmlFor="oc">
                <div className="flex gap-2">
                  <span className="inline-flex h-9 items-center rounded-md border bg-background px-2.5 text-[13px] text-muted-foreground">
                    ৳
                  </span>
                  <input
                    id="oc"
                    type="number"
                    value={basics.outsideCharge}
                    onChange={(e) => set({ outsideCharge: Number(e.target.value) })}
                    className={cn(inputCls, "font-mono tabular-nums")}
                  />
                </div>
              </Field>
              <Field label="How long, outside Dhaka" htmlFor="od">
                <input
                  id="od"
                  value={basics.outsideDays}
                  onChange={(e) => set({ outsideDays: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Free delivery over" hint="Set to 0 if you never do free delivery." htmlFor="fo">
              <div className="flex w-40 gap-2">
                <span className="inline-flex h-9 items-center rounded-md border bg-background px-2.5 text-[13px] text-muted-foreground">
                  ৳
                </span>
                <input
                  id="fo"
                  type="number"
                  value={basics.freeOver}
                  onChange={(e) => set({ freeOver: Number(e.target.value) })}
                  className={cn(inputCls, "font-mono tabular-nums")}
                />
              </div>
            </Field>
            <Field label="Which courier do you use?">
              <ChipPicker
                options={courierOptions}
                value={basics.couriers}
                onChange={(couriers) => set({ couriers })}
              />
            </Field>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Field label="Do you take cash on delivery?">
              <YesNo value={basics.cod} onChange={(cod) => set({ cod })} />
            </Field>
            <Field label="Which wallets do you accept?">
              <ChipPicker
                options={["bKash", "Nagad"]}
                value={[basics.bkash && "bKash", basics.nagad && "Nagad"].filter(
                  Boolean
                ) as string[]}
                onChange={(v) => set({ bkash: v.includes("bKash"), nagad: v.includes("Nagad") })}
              />
            </Field>
            {basics.cod ? (
              <Field
                label="Do you take something in advance for outside Dhaka?"
                hint="Most sellers do. It is the single biggest thing that stops parcels being refused at the door."
              >
                <div className="flex flex-wrap items-center gap-3">
                  <YesNo
                    value={basics.advanceOutside}
                    onChange={(advanceOutside) => set({ advanceOutside })}
                  />
                  {basics.advanceOutside ? (
                    <div className="flex w-36 gap-2">
                      <span className="inline-flex h-9 items-center rounded-md border bg-background px-2.5 text-[13px] text-muted-foreground">
                        ৳
                      </span>
                      <input
                        type="number"
                        aria-label="Advance amount"
                        value={basics.advanceAmount}
                        onChange={(e) => set({ advanceAmount: Number(e.target.value) })}
                        className={cn(inputCls, "font-mono tabular-nums")}
                      />
                    </div>
                  ) : null}
                </div>
              </Field>
            ) : null}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Field label="Do you accept returns?">
              <YesNo
                value={basics.acceptReturns}
                onChange={(acceptReturns) => set({ acceptReturns })}
              />
            </Field>
            {basics.acceptReturns ? (
              <>
                <Field label="Within how many days?" htmlFor="rd">
                  <input
                    id="rd"
                    type="number"
                    value={basics.returnDays}
                    onChange={(e) => set({ returnDays: Number(e.target.value) })}
                    className={cn(inputCls, "w-32 font-mono tabular-nums")}
                  />
                </Field>
                <Field label="Who pays the return delivery?">
                  <YesNo
                    value={basics.returnPaidBy === "shop"}
                    onChange={(v) => set({ returnPaidBy: v ? "shop" : "customer" })}
                    yes="We do"
                    no="Customer does"
                  />
                </Field>
              </>
            ) : null}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="You are around from" htmlFor="of">
                <input
                  id="of"
                  type="time"
                  value={basics.openFrom}
                  onChange={(e) => set({ openFrom: e.target.value })}
                  className={cn(inputCls, "font-mono tabular-nums")}
                />
              </Field>
              <Field label="Until" htmlFor="ot">
                <input
                  id="ot"
                  type="time"
                  value={basics.openTo}
                  onChange={(e) => set({ openTo: e.target.value })}
                  className={cn(inputCls, "font-mono tabular-nums")}
                />
              </Field>
            </div>
            <Field
              label="What should always come to you?"
              hint="The agents will not try to handle these on their own."
            >
              <ChipPicker
                options={alwaysHumanOptions}
                value={basics.alwaysHuman}
                onChange={(alwaysHuman) => set({ alwaysHuman })}
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t p-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>

        {step < last ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Next
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-live-ink">
            <Check className="size-3.5" strokeWidth={3} />
            That is everything
          </span>
        )}
      </div>
    </Panel>
  );
}

/* ---------------------------- Derived answers ----------------------------- */

function WhatItKnows({ basics }: { basics: BusinessBasics }) {
  const answers = derivedAnswers(basics);

  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader
        title="What it can answer now"
        description="Built from your answers. Changes as you type."
        action={
          <span className="font-mono text-[13px] font-medium tabular-nums">
            {answers.length}
          </span>
        }
      />
      <ul className="max-h-[34rem] divide-y overflow-y-auto">
        {answers.map((a) => (
          <li key={a.id} className="px-4 py-2.5">
            <div className="flex items-start gap-2">
              <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-live text-background">
                <Check className="size-2" strokeWidth={4} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-medium">{a.question}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                  {a.answer}
                </p>
                <Chip className="mt-1.5">{a.from}</Chip>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Stock, prices and where an order has got to are never answered from here.
          Those are read live, so they cannot go stale.
        </p>
      </div>
    </Panel>
  );
}

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
        title="Answering from a document"
        description="For anything the questions above do not cover."
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
          <ul className="mt-4 space-y-1.5">
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
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

function Library() {
  return (
    <Panel>
      <PanelHeader
        title="Documents"
        description="Optional. Only if you have written policies already."
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

/* ---------------------------------- Page ---------------------------------- */

export default function KnowledgePage() {
  const [basics, setBasics] = React.useState<BusinessBasics>(businessBasicsDefaults);
  const set = (patch: Partial<BusinessBasics>) =>
    setBasics((prev) => ({ ...prev, ...patch }));

  const answers = derivedAnswers(basics);
  const ready = knowledgeDocs.filter((d) => d.status === "indexed").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge"
        description="What your agents are allowed to tell people. Most of it comes from a handful of questions about how your shop works, so there is nothing to write and nothing to upload."
      />

      <MetricRow>
        <Metric
          label="Answers from your setup"
          value={answers.length}
          basis="no documents needed"
        />
        <Metric label="Documents added" value={knowledgeDocs.length} basis={`${ready} ready`} />
        <Metric label="Typical lookup" value="387ms" basis="question to answer" />
        <Metric label="Answers with a source" value="all of them" basis="no source, no claim" />
      </MetricRow>

      <Tabs defaultValue="setup">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <Setup basics={basics} set={set} />
            <WhatItKnows basics={basics} />
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <RetrievalDemo />
            <Library />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
