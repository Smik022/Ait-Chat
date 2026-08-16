"use client";

import * as React from "react";
import { Lock, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  guardrailActions,
  guardrailOutcomes,
  guardrails as seedGuardrails,
  platformGuardrails,
  type Guardrail,
  type GuardrailAction,
  type GuardrailOutcome,
} from "@/lib/data";
import { useLive, useMounted } from "@/lib/live";
import {
  Chip,
  Metric,
  MetricRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

/** The rule, written as a sentence. This is the whole idea of the page. */
function RuleSentence({ rule }: { rule: Guardrail }) {
  const action = guardrailActions[rule.action];
  const outcome = guardrailOutcomes[rule.outcome];
  return (
    <p className="text-[13px] leading-relaxed">
      <span className="text-muted-foreground">If an agent tries to </span>
      <span className="font-medium">{action.label}</span>
      <span className="text-muted-foreground"> {rule.condition}</span>
      <span className="text-muted-foreground">, then </span>
      <span className={cn("font-medium", outcome.tone)}>{outcome.label}</span>
    </p>
  );
}

/* -------------------------------- Add form -------------------------------- */

function AddRule({ onAdd, onCancel }: { onAdd: (r: Guardrail) => void; onCancel: () => void }) {
  const [action, setAction] = React.useState<GuardrailAction>("refund");
  const [threshold, setThreshold] = React.useState<number>(3000);
  const [choice, setChoice] = React.useState<string>("");
  const [outcome, setOutcome] = React.useState<GuardrailOutcome>("ask");

  const meta = guardrailActions[action];
  const needsNumber = meta.unit !== "choice";
  const conditions = meta.conditions ?? [];
  const selectedChoice = choice && conditions.includes(choice) ? choice : conditions[0];

  const condition = needsNumber
    ? meta.unit === "percent"
      ? `more than ${threshold}%`
      : `more than ৳${threshold.toLocaleString("en-IN")}`
    : selectedChoice;

  const submit = () => {
    onAdd({
      id: `G-${Math.round(performance.now())}`,
      action,
      condition,
      threshold: needsNumber ? threshold : undefined,
      outcome,
      enabled: true,
      stoppedThisWeek: 0,
    });
    toast.success("Rule added", {
      description: `${guardrailOutcomes[outcome].description}`,
    });
  };

  return (
    <div className="border-t bg-muted/30 p-4">
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="text-muted-foreground">If an agent tries to</span>

        <select
          value={action}
          onChange={(e) => {
            const next = e.target.value as GuardrailAction;
            setAction(next);
            const d = guardrailActions[next].defaultThreshold;
            if (d) setThreshold(d);
          }}
          aria-label="Action"
          className="h-8 rounded-md border bg-background px-2 text-[13px] font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {(Object.keys(guardrailActions) as GuardrailAction[]).map((k) => (
            <option key={k} value={k}>
              {guardrailActions[k].label}
            </option>
          ))}
        </select>

        {needsNumber ? (
          <>
            <span className="text-muted-foreground">of more than</span>
            <span className="inline-flex h-8 items-center rounded-md border bg-background">
              {meta.unit === "taka" ? (
                <span className="pl-2 text-muted-foreground">৳</span>
              ) : null}
              <input
                type="number"
                min={1}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="Threshold"
                className="h-full w-20 bg-transparent px-2 font-mono text-[13px] tabular-nums outline-none"
              />
              {meta.unit === "percent" ? (
                <span className="pr-2 text-muted-foreground">%</span>
              ) : null}
            </span>
          </>
        ) : (
          <select
            value={selectedChoice}
            onChange={(e) => setChoice(e.target.value)}
            aria-label="When"
            className="h-8 rounded-md border bg-background px-2 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        <span className="text-muted-foreground">then</span>

        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as GuardrailOutcome)}
          aria-label="What should happen"
          className="h-8 rounded-md border bg-background px-2 text-[13px] font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {(Object.keys(guardrailOutcomes) as GuardrailOutcome[]).map((k) => (
            <option key={k} value={k}>
              {guardrailOutcomes[k].label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {guardrailOutcomes[outcome].description}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add rule
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export default function GuardrailsPage() {
  const { events, live } = useLive();
  const mounted = useMounted();
  const [rules, setRules] = React.useState<Guardrail[]>(seedGuardrails);
  const [adding, setAdding] = React.useState(false);

  const active = rules.filter((r) => r.enabled).length + platformGuardrails.length;
  const stopped =
    rules.reduce((n, r) => n + r.stoppedThisWeek, 0) +
    platformGuardrails.reduce((n, r) => n + r.stoppedThisWeek, 0);
  const askRules = rules.filter((r) => r.enabled && r.outcome === "ask");
  const handoffRules = rules.filter((r) => r.enabled && r.outcome === "handoff");
  const handedOver = handoffRules.reduce((n, r) => n + r.stoppedThisWeek, 0);

  const recentlyStopped = events.filter((e) => e.outcome === "blocked").slice(0, 6);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Guardrails"
        description="Rules your agents have to follow. They are checked in code every single time. The AI is never asked whether a rule applies to it."
      />

      <MetricRow>
        <Metric label="Rules on" value={active} basis={`${platformGuardrails.length} you cannot switch off`} />
        <Metric label="Caught this week" value={stopped} basis="rules that fired" />
        <Metric
          label="Handed to a person"
          value={handedOver}
          basis={`${handoffRules.length} rules do this`}
        />
        <Metric
          label="Waiting on your approval"
          value={askRules.length}
          basis="rules that ask before acting"
        />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-5">
          <Panel>
            <PanelHeader
              title="Your rules"
              description="Change these whenever you like. They take effect on the next message."
              action={
                !adding ? (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Plus className="size-3" />
                    Add a rule
                  </button>
                ) : null
              }
            />

            <ul className="divide-y">
              {rules.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn("min-w-0 flex-1", !r.enabled && "opacity-45")}>
                    <RuleSentence rule={r} />
                    {r.stoppedThisWeek > 0 ? (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Stopped{" "}
                        <span className="font-mono tabular-nums">
                          {r.stoppedThisWeek}
                        </span>{" "}
                        {r.stoppedThisWeek === 1 ? "thing" : "things"} this week
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={r.enabled}
                    aria-label={`${guardrailActions[r.action].label} rule: ${r.enabled ? "on" : "off"}`}
                    onClick={() =>
                      setRules((prev) =>
                        prev.map((x) =>
                          x.id === r.id ? { ...x, enabled: !x.enabled } : x
                        )
                      )
                    }
                    className={cn(
                      "relative h-4 w-7 shrink-0 rounded-full transition-colors",
                      r.enabled ? "bg-live" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-3 rounded-full bg-background transition-all",
                        r.enabled ? "left-3.5" : "left-0.5"
                      )}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRules((prev) => prev.filter((x) => x.id !== r.id));
                      toast("Rule removed");
                    }}
                    aria-label="Remove this rule"
                    className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-block"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}

              {rules.length === 0 ? (
                <li className="px-4 py-10 text-center">
                  <p className="text-[13px] font-medium">No rules of your own yet</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Your agents can still only do what they have been given tools for,
                    and the platform rules below always apply.
                  </p>
                </li>
              ) : null}
            </ul>

            {adding ? (
              <AddRule
                onAdd={(r) => {
                  setRules((prev) => [...prev, r]);
                  setAdding(false);
                }}
                onCancel={() => setAdding(false)}
              />
            ) : null}
          </Panel>

          <Panel>
            <PanelHeader
              title="Always on"
              description="Platform rules. Not ours to switch off, and not yours."
            />
            <ul className="divide-y">
              {platformGuardrails.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <RuleSentence rule={r} />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {r.lockedReason}
                    </p>
                  </div>
                  <Chip>Always on</Chip>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel>
          <PanelHeader
            title="Recently stopped"
            description="Things an agent wanted to do and was not allowed to."
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StatusDot
                  className={live ? "bg-live" : "bg-muted-foreground"}
                  pulse={live}
                />
                {live ? "live" : "paused"}
              </span>
            }
          />
          <ul className="divide-y">
            {(mounted ? recentlyStopped : recentlyStopped.slice(0, 3)).map((e) => (
              <li key={e.id} className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <X className="size-3 shrink-0 text-block" strokeWidth={3} />
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {e.time}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {e.detail}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t px-4 py-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Every one of these is kept, whether it was later approved or not.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
