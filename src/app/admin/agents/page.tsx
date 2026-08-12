"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, CornerDownRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  agents,
  channelMeta,
  humanTeam,
  languagePolicies,
  modelById,
  modelCatalog,
  toneOptions,
  toolCatalog,
  type AgentDef,
  type AgentRole,
  type Channel,
} from "@/lib/data";
import { useLive, useMounted } from "@/lib/live";
import { BrandMark } from "@/components/brand-logos";
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

const CHANNELS: Channel[] = ["instagram", "facebook", "whatsapp", "web"];
const SPECIALISTS: AgentRole[] = ["sales", "support", "retention", "operations"];

type Config = Pick<
  AgentDef,
  "model" | "temperature" | "maxTokens" | "tone" | "languagePolicy" | "systemPrompt" | "tools"
>;

const initialConfigs = (): Record<string, Config> =>
  Object.fromEntries(
    agents.map((a) => [
      a.id,
      {
        model: a.model,
        temperature: a.temperature,
        maxTokens: a.maxTokens,
        tone: a.tone,
        languagePolicy: a.languagePolicy,
        systemPrompt: a.systemPrompt,
        tools: [...a.tools],
      },
    ])
  );

/* ------------------------------ Model picker ----------------------------- */

function ModelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {modelCatalog.map((m) => {
        const active = m.id === value;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            aria-pressed={active}
            className={cn(
              "rounded-md border p-3 text-left transition-colors",
              active ? "border-foreground bg-muted" : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-2">
              <BrandMark brand={m.provider} className="size-4 text-foreground" />
              <span className="text-[13px] font-medium">{m.name}</span>
              {active ? (
                <Check className="ml-auto size-3.5 shrink-0" strokeWidth={3} />
              ) : null}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {m.note}
            </p>
            <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              <div className="flex gap-1">
                <dt>Context</dt>
                <dd className="font-mono text-foreground/80">{m.context}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Median</dt>
                <dd className="font-mono text-foreground/80">{m.medianLatency}</dd>
              </div>
              <div className="flex items-center gap-1">
                <dt>Cost</dt>
                <dd className="flex gap-0.5" aria-label={`Relative cost ${m.relativeCost} of 3`}>
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={cn(
                        "block h-2 w-1 rounded-[1px]",
                        n <= m.relativeCost ? "bg-foreground/70" : "bg-muted-foreground/25"
                      )}
                    />
                  ))}
                </dd>
              </div>
            </dl>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------- Configuration pane -------------------------- */

function ConfigPane({
  agent,
  config,
  onChange,
  onReset,
  dirty,
}: {
  agent: AgentDef;
  config: Config;
  onChange: (patch: Partial<Config>) => void;
  onReset: () => void;
  dirty: boolean;
}) {
  const model = modelById(config.model);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted font-mono text-[11px] font-medium">
            {agent.initials}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold">{agent.name}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <StatusDot
                  className={
                    agent.status === "online"
                      ? "bg-live"
                      : agent.status === "busy"
                        ? "bg-pend"
                        : "bg-muted-foreground"
                  }
                  pulse={agent.status === "busy"}
                />
                {agent.status}
              </span>
            </div>
            <p className="truncate text-[11px] text-muted-foreground">{agent.title}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {dirty ? (
              <>
                <Chip tone="bg-pend-soft text-pend-ink">Unsaved</Chip>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <RotateCcw className="size-3" />
                  Revert
                </button>
              </>
            ) : null}
            <button
              type="button"
              disabled={!dirty}
              onClick={() =>
                toast.success(`${agent.name} updated`, {
                  description: `Now running ${model.name}. Changes apply to new conversations.`,
                })
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="space-y-5 p-4">
          <section>
            <h3 className="text-[13px] font-medium">Model</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Each agent can run on a different model. Classification is cheap and
              should be fast; anything touching money should be careful.
            </p>
            <div className="mt-2.5">
              <ModelPicker
                value={config.model}
                onChange={(model) => onChange({ model })}
              />
            </div>
          </section>

          <section className="border-t pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[13px] font-medium">Instructions</h3>
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {config.systemPrompt.length} chars
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              How this agent should behave. Written for the agent, not for a customer.
            </p>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => onChange({ systemPrompt: e.target.value })}
              spellCheck={false}
              aria-label={`System instructions for the ${agent.name} agent`}
              className="mt-2.5 min-h-[15rem] w-full resize-y rounded-md border bg-background px-3 py-2.5 font-mono text-[12px] leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </section>

          <section className="border-t pt-4">
            <h3 className="text-[13px] font-medium">Voice</h3>
            <div className="mt-2.5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`tone-${agent.id}`}
                  className="text-[11px] font-medium text-muted-foreground"
                >
                  Tone
                </label>
                <select
                  id={`tone-${agent.id}`}
                  value={config.tone}
                  onChange={(e) => onChange({ tone: e.target.value })}
                  className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {toneOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {toneOptions.find((t) => t.id === config.tone)?.hint}
                </p>
              </div>

              <div>
                <label
                  htmlFor={`lang-${agent.id}`}
                  className="text-[11px] font-medium text-muted-foreground"
                >
                  Reply language
                </label>
                <select
                  id={`lang-${agent.id}`}
                  value={config.languagePolicy}
                  onChange={(e) => onChange({ languagePolicy: e.target.value })}
                  className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {languagePolicies.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {languagePolicies.find((l) => l.id === config.languagePolicy)?.hint}
                </p>
              </div>

              <div>
                <label
                  htmlFor={`temp-${agent.id}`}
                  className="flex items-baseline justify-between text-[11px] font-medium text-muted-foreground"
                >
                  Temperature
                  <span className="font-mono text-[11px] tabular-nums text-foreground">
                    {config.temperature.toFixed(1)}
                  </span>
                </label>
                <input
                  id={`temp-${agent.id}`}
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={config.temperature}
                  onChange={(e) =>
                    onChange({ temperature: Number(e.target.value) })
                  }
                  className="mt-2 w-full accent-foreground"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {config.temperature <= 0.2
                    ? "Near-deterministic. Right for classification and policy."
                    : config.temperature <= 0.5
                      ? "Some variation in wording, same substance."
                      : "Looser phrasing. Keep away from money paths."}
                </p>
              </div>

              <div>
                <label
                  htmlFor={`tokens-${agent.id}`}
                  className="text-[11px] font-medium text-muted-foreground"
                >
                  Reply length cap
                </label>
                <input
                  id={`tokens-${agent.id}`}
                  type="number"
                  min={128}
                  max={2000}
                  step={64}
                  value={config.maxTokens}
                  onChange={(e) => onChange({ maxTokens: Number(e.target.value) })}
                  className="mt-1 h-8 w-full rounded-md border bg-background px-2 font-mono text-[13px] tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Tokens. A DM reply rarely needs more than 300.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-4">
            <h3 className="text-[13px] font-medium">What it can do</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Untick anything you would rather it did not. Whatever stays on is still
              checked against your guardrails every time.
            </p>
            <ul className="mt-2.5 space-y-1">
              {toolCatalog
                .filter((t) => t.scopes.includes(agent.id))
                .map((t) => {
                  const on = config.tools.includes(t.name);
                  return (
                    <li key={t.name}>
                      <label className="flex cursor-pointer items-start gap-2.5 rounded-md border px-2.5 py-2 transition-colors hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            onChange({
                              tools: on
                                ? config.tools.filter((x) => x !== t.name)
                                : [...config.tools, t.name],
                            })
                          }
                          className="mt-0.5 size-3.5 shrink-0 accent-foreground"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[12px] font-medium">{t.label}</span>
                            {t.mutating ? (
                              <Chip tone="bg-pend-soft text-pend-ink">changes things</Chip>
                            ) : (
                              <Chip>just looks</Chip>
                            )}
                            {t.gatedBy ? (
                              <Chip tone="bg-block-soft text-block-ink">
                                has a rule
                              </Chip>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">
                            {t.description}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          </section>

          <section className="border-t pt-4">
            <h3 className="text-[13px] font-medium">Hands over when</h3>
            <p className="mt-1.5 flex items-start gap-1.5 text-[12px]">
              <CornerDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
              {agent.escalation}
            </p>
          </section>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------ Orchestration ---------------------------- */

function Node({
  label,
  sub,
  active,
  tone = "default",
  className,
}: {
  label: string;
  sub?: string;
  active?: boolean;
  tone?: "default" | "machine" | "person";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card px-2.5 py-1.5 text-center transition-colors duration-200",
        active && tone === "default" && "border-live bg-live-soft",
        active && tone === "machine" && "border-machine bg-machine-soft",
        active && tone === "person" && "border-pend bg-pend-soft",
        className
      )}
    >
      <div className="truncate text-[12px] font-medium">{label}</div>
      {sub ? (
        <div className="truncate text-[10px] text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
}

function Connector({ active }: { active?: boolean }) {
  return (
    <div className="flex justify-center py-1.5" aria-hidden>
      <span
        className={cn(
          "block h-4 w-px transition-colors duration-200",
          active ? "bg-live" : "bg-border"
        )}
      />
    </div>
  );
}

function Orchestration() {
  const { beat, live } = useLive();
  const mounted = useMounted();
  const activeIndex = mounted && live ? beat % SPECIALISTS.length : -1;
  const escalating = mounted && live ? beat % 5 === 4 : false;

  return (
    <Panel>
      <PanelHeader
        title="How a message moves"
        description="One agent reads every message and decides who handles it. Nothing touching money happens without clearing your rules first."
      />
      <div className="p-4">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-4 gap-2">
            {CHANNELS.map((ch) => (
              <Node key={ch} label={channelMeta[ch].label} className="border-dashed" />
            ))}
          </div>

          <Connector active={activeIndex >= 0} />
          <Node
            label="Router"
            sub="intent · language · sentiment"
            active={activeIndex >= 0}
            tone="machine"
          />
          <Connector active={activeIndex >= 0} />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SPECIALISTS.map((role, i) => {
              const def = agents.find((a) => a.id === role)!;
              return (
                <Node
                  key={role}
                  label={def.name}
                  sub={`${def.tools.length} things it can do`}
                  active={i === activeIndex}
                />
              );
            })}
          </div>

          <Connector active={activeIndex >= 0} />
          <Node
            label="Your guardrails"
            sub="checked before anything happens"
            active={activeIndex >= 0}
          />
          <Connector active={escalating} />
          <Node
            label="Manager"
            sub="approvals and exceptions"
            active={escalating}
            tone="person"
          />
          <Connector active={escalating} />
          <Node
            label="Human inbox"
            sub={`${humanTeam.filter((h) => h.online).length} people online`}
            active={escalating}
            tone="person"
          />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
          A specialist can also hand back to the Router mid-conversation. A sales
          thread that turns into a return is re-classified rather than forced down the
          wrong path.
        </p>
      </div>
    </Panel>
  );
}

function HumanTeam() {
  return (
    <Panel>
      <PanelHeader
        title="People on shift"
        description="Every automated thread has somewhere to go."
      />
      <ul className="divide-y">
        {humanTeam.map((h) => (
          <li key={h.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-medium">
              {h.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{h.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {h.role}
              </span>
            </span>
            <Chip tone={h.online ? "bg-live-soft text-live-ink" : undefined}>
              {h.online ? "online" : "off shift"}
            </Chip>
          </li>
        ))}
      </ul>
      <div className="border-t px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Meta requires every automated messaging app to offer a route to a person.
          Handover carries the transcript, the sentiment score and the order context, so
          nobody starts cold.
        </p>
      </div>
    </Panel>
  );
}

/* --------------------------------- Page ---------------------------------- */

export default function AgentsPage() {
  const [selected, setSelected] = React.useState<AgentRole>("sales");
  const [configs, setConfigs] = React.useState<Record<string, Config>>(initialConfigs);

  const agent = agents.find((a) => a.id === selected)!;
  const config = configs[selected];
  const pristine = React.useMemo(() => initialConfigs(), []);
  const dirty = JSON.stringify(config) !== JSON.stringify(pristine[selected]);

  const patch = (p: Partial<Config>) =>
    setConfigs((prev) => ({ ...prev, [selected]: { ...prev[selected], ...p } }));

  const reset = () =>
    setConfigs((prev) => ({ ...prev, [selected]: { ...pristine[selected] } }));

  const dirtyCount = agents.filter(
    (a) => JSON.stringify(configs[a.id]) !== JSON.stringify(pristine[a.id])
  ).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agents"
        description="Six agents, each with its own model, its own instructions and a deliberately small set of tools. Change how any of them behaves here."
        actions={
          <Link
            href="/admin/guardrails"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            What they are allowed to do
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <MetricRow>
        <Metric label="Agents in service" value={agents.length} basis="one router, five workers" />
        <Metric
          label="Models in use"
          value={new Set(agents.map((a) => configs[a.id].model)).size}
          basis="mixed by task, not one for everything"
        />
        <Metric
          label="Threads open now"
          value={agents.reduce((n, a) => n + a.handlesNow, 0)}
          basis="across all six"
        />
        <Metric
          label="Unsaved changes"
          value={dirtyCount}
          basis={dirtyCount ? "agents edited this session" : "everything deployed"}
        />
      </MetricRow>

      <Tabs defaultValue="configuration">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            <Panel className="h-fit">
              <PanelHeader title="Workforce" description="Pick one to configure." />
              <ul className="divide-y">
                {agents.map((a) => {
                  const active = a.id === selected;
                  const edited =
                    JSON.stringify(configs[a.id]) !== JSON.stringify(pristine[a.id]);
                  const m = modelById(configs[a.id].model);
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(a.id)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                          active ? "bg-muted" : "hover:bg-muted/50"
                        )}
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded bg-muted-foreground/15 font-mono text-[10px] font-medium">
                          {a.initials}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate text-[13px] font-medium">
                              {a.name}
                            </span>
                            {edited ? <StatusDot className="bg-pend" /> : null}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <BrandMark brand={m.provider} className="size-2.5" />
                            <span className="truncate">{m.name}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <ConfigPane
              agent={agent}
              config={config}
              onChange={patch}
              onReset={reset}
              dirty={dirty}
            />
          </div>
        </TabsContent>

        <TabsContent value="orchestration">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <Orchestration />
            <HumanTeam />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
