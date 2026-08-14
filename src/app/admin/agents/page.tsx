"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CornerDownRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  agents,
  channelMeta,
  humanTeam,
  languagePolicies,
  toneOptions,
  toolCatalog,
  type AgentDef,
  type AgentRole,
  type Channel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHANNELS: Channel[] = ["instagram", "facebook", "whatsapp", "web"];
const SPECIALISTS: AgentRole[] = ["sales", "support", "retention", "operations"];

type Config = Pick<AgentDef, "tone" | "languagePolicy" | "systemPrompt" | "tools">;

const initialConfigs = (): Record<string, Config> =>
  Object.fromEntries(
    agents.map((a) => [
      a.id,
      {
        tone: a.tone,
        languagePolicy: a.languagePolicy,
        systemPrompt: a.systemPrompt,
        tools: [...a.tools],
      },
    ])
  );

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
  const canDo = toolCatalog.filter((t) => t.scopes.includes(agent.id));

  return (
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
                Undo
              </button>
            </>
          ) : null}
          <button
            type="button"
            disabled={!dirty}
            onClick={() =>
              toast.success(`${agent.name} updated`, {
                description: "Applies to new conversations from now on.",
              })
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{agent.focus}</p>

        <section className="border-t pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`tone-${agent.id}`}
                className="text-[12px] font-medium"
              >
                How it should sound
              </label>
              <select
                id={`tone-${agent.id}`}
                value={config.tone}
                onChange={(e) => onChange({ tone: e.target.value })}
                className="mt-1.5 h-9 w-full rounded-md border bg-background px-2.5 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {toneOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {toneOptions.find((t) => t.id === config.tone)?.hint}
              </p>
            </div>

            <div>
              <label
                htmlFor={`lang-${agent.id}`}
                className="text-[12px] font-medium"
              >
                What language to reply in
              </label>
              <select
                id={`lang-${agent.id}`}
                value={config.languagePolicy}
                onChange={(e) => onChange({ languagePolicy: e.target.value })}
                className="mt-1.5 h-9 w-full rounded-md border bg-background px-2.5 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {languagePolicies.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {languagePolicies.find((l) => l.id === config.languagePolicy)?.hint}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-4">
          <label htmlFor={`brief-${agent.id}`} className="text-[12px] font-medium">
            Anything else it should know
          </label>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Write it the way you would tell a new shop assistant on their first day.
          </p>
          <textarea
            id={`brief-${agent.id}`}
            value={config.systemPrompt}
            onChange={(e) => onChange({ systemPrompt: e.target.value })}
            spellCheck={false}
            className="mt-2 min-h-[13rem] w-full resize-y rounded-md border bg-background px-3 py-2.5 text-[13px] leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </section>

        <section className="border-t pt-4">
          <h3 className="text-[12px] font-medium">What it can do</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Untick anything you would rather it did not. Whatever stays on is still
            checked against your guardrails every time.
          </p>
          <ul className="mt-2.5 space-y-1">
            {canDo.map((t) => {
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
                          <Chip tone="bg-block-soft text-block-ink">has a rule</Chip>
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
          <h3 className="text-[12px] font-medium">When it comes to you</h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-[13px]">
            <CornerDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            {agent.escalation}
          </p>
        </section>
      </div>
    </Panel>
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
        description="One of them reads every message and decides who handles it. Nothing touching money happens without clearing your rules first."
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
            sub="works out what they want"
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
            sub="decides the awkward ones"
            active={escalating}
            tone="person"
          />
          <Connector active={escalating} />
          <Node
            label="You"
            sub={`${humanTeam.filter((h) => h.online).length} people around`}
            active={escalating}
            tone="person"
          />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
          They can also hand back mid-conversation. A sale that turns into a return
          gets re-read rather than forced down the wrong path.
        </p>
      </div>
    </Panel>
  );
}

function HumanTeam() {
  return (
    <Panel>
      <PanelHeader title="People on shift" description="Where anything awkward ends up." />
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
              {h.online ? "around" : "off"}
            </Chip>
          </li>
        ))}
      </ul>
      <div className="border-t px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Meta requires every automated account to offer a way through to a person, so
          this is not optional. Handover carries the whole conversation and the order, so
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

  const edited = agents.filter(
    (a) => JSON.stringify(configs[a.id]) !== JSON.stringify(pristine[a.id])
  ).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Your team"
        description="Six helpers with one job each. Change how any of them sounds, what it is allowed to do, and when it should come and get you."
        actions={
          <Link
            href="/admin/guardrails"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            Your rules
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <MetricRow>
        <Metric label="Helpers" value={agents.length} basis="one reads, five do the work" />
        <Metric
          label="Conversations open now"
          value={agents.reduce((n, a) => n + a.handlesNow, 0)}
          basis="across all of them"
        />
        <Metric
          label="Came to you this month"
          value={agents.reduce((n, a) => n + a.kpis.handoffs, 0)}
          basis="the rest they handled"
        />
        <Metric
          label="Unsaved changes"
          value={edited}
          basis={edited ? "helpers edited" : "everything saved"}
        />
      </MetricRow>

      <Tabs defaultValue="team">
        <TabsList>
          <TabsTrigger value="team">Your team</TabsTrigger>
          <TabsTrigger value="how">How it works</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <Panel className="h-fit">
              <PanelHeader title="Pick one" description="To change how it works." />
              <ul className="divide-y">
                {agents.map((a) => {
                  const active = a.id === selected;
                  const changed =
                    JSON.stringify(configs[a.id]) !== JSON.stringify(pristine[a.id]);
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
                            {changed ? <StatusDot className="bg-pend" /> : null}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {a.title}
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

        <TabsContent value="how">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <Orchestration />
            <HumanTeam />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
