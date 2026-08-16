"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CornerDownRight,
  Plug,
  Plus,
  RotateCcw,
  Unplug,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  actionLabel,
  agentById,
  agents,
  channelMeta,
  facebookPages,
  integrations,
  languagePolicies,
  pageById,
  toneOptions,
  toolCatalog,
  type AgentDef,
  type Channel,
} from "@/lib/data";
import { useLive, useMounted } from "@/lib/live";
import { BrandMark } from "@/components/brand-logos";
import {
  Chip,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CHANNELS: Channel[] = ["instagram", "facebook", "whatsapp", "web"];

/** Everything a customer-facing agent is ever allowed to do. */
const CUSTOMER_TOOLS = toolCatalog.filter((t) => t.scopes.includes("assistant"));

const assistant = agentById("assistant");
const manager = agentById("manager");

type Config = Pick<AgentDef, "tone" | "languagePolicy" | "systemPrompt" | "tools">;

const defaultConfig = (): Config => ({
  tone: "warm",
  languagePolicy: "mirror",
  systemPrompt: "",
  tools: [...assistant.tools],
});

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

const statusColor = (status: AgentDef["status"]) =>
  status === "online"
    ? "bg-live"
    : status === "busy"
      ? "bg-pend"
      : "bg-muted-foreground";

/* ------------------------------ Connect a page ---------------------------- */

function ConnectPageDialog({
  agentId,
  agentName,
  assignedTo,
  onConnect,
}: {
  agentId: string;
  agentName: string;
  assignedTo: Record<string, string | undefined>;
  onConnect: (pageId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);

  const takenBy = (pageId: string) => {
    for (const [aid, pid] of Object.entries(assignedTo)) {
      if (aid !== agentId && pid === pageId) return agentName;
    }
    return undefined;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSelected(null);
      }}
    >
      <button
        type="button"
        onClick={() => {
          setSelected(null);
          setOpen(true);
        }}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        <Plug className="size-3" />
        Connect a page
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a Facebook page</DialogTitle>
          <DialogDescription>
            Pick the page this agent answers. It only sees messages and comments
            from that page.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-1.5">
          {facebookPages.map((p) => {
            const owner = takenBy(p.id);
            const disabled = owner !== undefined;
            const active = selected === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(p.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-live bg-live-soft"
                      : disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-muted"
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[10px] font-medium">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {p.name}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {p.handle} · {p.followers} followers
                    </span>
                  </span>
                  {owner ? (
                    <Chip>on {owner}</Chip>
                  ) : active ? (
                    <Chip tone="bg-live-soft text-live-ink">Selected</Chip>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="rounded-md border bg-muted/40 px-3 py-2.5">
          <div className="text-[11px] font-medium">What connecting grants</div>
          <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
            <li>Read and reply to Page messages.</li>
            <li>Read comments and engagement on Page posts.</li>
          </ul>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <button className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted">
                Cancel
              </button>
            }
          />
          <button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onConnect(selected);
              setOpen(false);
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plug className="size-3" />
            Connect page
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Create an agent --------------------------- */

function CreateAgentDialog({
  freePages,
  onCreate,
  triggerClassName,
}: {
  freePages: typeof facebookPages;
  onCreate: (name: string, pageId?: string) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [pageId, setPageId] = React.useState("");

  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), pageId || undefined);
    setOpen(false);
    setName("");
    setPageId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90",
          triggerClassName
        )}
      >
        <Plus className="size-3.5" />
        Add an agent
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an agent</DialogTitle>
          <DialogDescription>
            A second pair of hands, with its own tone, its own brief and its own
            page. You can change everything after.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor="agent-name" className="text-[12px] font-medium">
            What should it be called?
          </label>
          <input
            id="agent-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="e.g. Night shift"
            autoFocus
            className="mt-1.5 h-9 w-full rounded-md border bg-background px-2.5 text-[13px] outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div>
          <label htmlFor="agent-page" className="text-[12px] font-medium">
            Which page will it answer?
          </label>
          <select
            id="agent-page"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="mt-1.5 h-9 w-full rounded-md border bg-background px-2.5 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Not yet, connect later</option>
            {freePages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.handle}
              </option>
            ))}
          </select>
          {freePages.length === 0 ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Every page already has an agent on it.
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <button className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted">
                Cancel
              </button>
            }
          />
          <button
            type="button"
            disabled={!name.trim()}
            onClick={submit}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="size-3.5" />
            Add agent
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------- The roster ------------------------------- */

function Roster({
  list,
  selectedId,
  onSelect,
  pagesOf,
  freePages,
  onCreate,
}: {
  list: AgentDef[];
  selectedId: string;
  onSelect: (id: string) => void;
  pagesOf: Record<string, string | undefined>;
  freePages: typeof facebookPages;
  onCreate: (name: string, pageId?: string) => void;
}) {
  return (
    <Panel className="self-start lg:sticky lg:top-16">
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <span className="text-[12px] font-semibold">Your agents</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {list.length}
        </span>
      </div>
      <ul className="p-1.5">
        {list.map((a) => {
          const pageId = pagesOf[a.id];
          const page = pageId ? pageById(pageId) : undefined;
          const sub =
            a.id === "manager"
              ? "approvals only"
              : page
                ? page.name
                : "No page yet";
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onSelect(a.id)}
                aria-pressed={selectedId === a.id}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors",
                  selectedId === a.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted font-mono text-[11px] font-medium">
                  {a.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium">
                      {a.name}
                    </span>
                    {a.id === "manager" ? (
                      <Chip tone="bg-machine-soft text-machine-ink">system</Chip>
                    ) : null}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {sub}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <StatusDot
                    className={statusColor(a.status)}
                    pulse={a.status === "busy"}
                  />
                  {a.id !== "manager" ? (
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {a.handlesNow}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t p-2">
        <CreateAgentDialog
          freePages={freePages}
          onCreate={onCreate}
          triggerClassName="w-full justify-center"
        />
      </div>
    </Panel>
  );
}

/* ---------------------------- Connect a channel --------------------------- */

function ChannelConnect() {
  const channels = integrations.filter(
    (i) => i.kind === "channel" && (i.id === "fb" || i.id === "wa")
  );
  return (
    <Panel>
      <PanelHeader
        title="Connect a channel"
        description="The pages and numbers your customers already talk to."
        action={
          <Link
            href="/admin/integrations"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All connections
            <ArrowRight className="size-3" />
          </Link>
        }
      />
      <ul className="divide-y">
        {channels.map((c) => {
          const connected = c.status === "connected";
          return (
            <li key={c.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded border bg-card">
                <BrandMark brand={c.brand} className="size-3.5 text-foreground" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">
                  {c.name}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {c.account}
                </span>
              </span>
              {connected ? (
                <Chip tone="bg-live-soft text-live-ink">
                  <Check className="size-3" strokeWidth={3} />
                  Connected
                </Chip>
              ) : (
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Plus className="size-3" />
                  Connect
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ---------------------------- Agent settings ------------------------------ */

function AgentSettings({
  agent,
  config,
  onChange,
  onReset,
  dirty,
  page,
  agentName,
  assignedTo,
  onConnectPage,
  onDisconnectPage,
}: {
  agent: AgentDef;
  config: Config;
  onChange: (patch: Partial<Config>) => void;
  onReset: () => void;
  dirty: boolean;
  page?: string;
  agentName: string;
  assignedTo: Record<string, string | undefined>;
  onConnectPage: (pageId: string) => void;
  onDisconnectPage: () => void;
}) {
  const connected = page ? pageById(page) : undefined;

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
              <StatusDot className={statusColor(agent.status)} pulse={agent.status === "busy"} />
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

        <section className="grid gap-4 border-t pt-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`tone-${agent.id}`} className="text-[12px] font-medium">
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
            <label htmlFor={`lang-${agent.id}`} className="text-[12px] font-medium">
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
        </section>

        <section className="border-t pt-4">
          <h3 className="text-[12px] font-medium">When it comes to you</h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-[13px]">
            <CornerDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            {agent.escalation}
          </p>
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
            placeholder="Optional. It already knows your products, policies and the basics. Add the exceptions and preferences here."
            className="mt-2 min-h-[10rem] w-full resize-y rounded-md border bg-background px-3 py-2.5 text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </section>

        <section className="border-t pt-4">
          <h3 className="text-[12px] font-medium">What it can do</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Untick anything you would rather it did not. Whatever stays on is still
            checked against your rules every time.
          </p>
          <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {CUSTOMER_TOOLS.map((t) => {
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
          <h3 className="text-[12px] font-medium">Where it answers</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            It takes comments and DMs from the page it is connected to. Without a
            page it sees nothing.
          </p>
          {connected ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-3 rounded-md border px-3 py-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[10px] font-medium">
                {connected.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">
                  {connected.name}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {connected.handle} · {connected.followers} followers
                </span>
              </span>
              <Chip tone="bg-live-soft text-live-ink">Connected</Chip>
              <button
                type="button"
                onClick={onDisconnectPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Unplug className="size-3" />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed px-3 py-2.5">
              <span className="text-[12px] text-muted-foreground">
                Not connected to a page
              </span>
              <ConnectPageDialog
                agentId={agent.id}
                agentName={agentName}
                assignedTo={assignedTo}
                onConnect={onConnectPage}
              />
            </div>
          )}
        </section>
      </div>
    </Panel>
  );
}

/* ------------------------------ The approver ------------------------------ */

function ManagerDetail() {
  return (
    <Panel>
      <PanelHeader
        title="The approver"
        description="What the Assistant is not allowed to decide alone ends up here."
      />
      <div className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] font-medium">
            {manager.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium">
              {manager.name}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              approvals only · never customer-facing
            </span>
          </span>
          <Chip tone="bg-machine-soft text-machine-ink">system</Chip>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          {manager.focus}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {manager.tools.map((t) => (
            <Chip key={t}>{actionLabel(t)}</Chip>
          ))}
        </div>
        <p className="mt-3 border-t pt-3 text-[11px] leading-relaxed text-muted-foreground">
          You cannot change what the approver is allowed to do. That is the part of
          the system that keeps the money calls honest.
        </p>
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
  const working = mounted && live ? beat % 3 !== 2 : false;
  const escalating = mounted && live ? beat % 5 === 4 : false;

  return (
    <Panel>
      <PanelHeader
        title="How a message moves"
        description="One assistant runs the whole thread. It proposes every action, your rules check it, and anything it cannot decide goes to the Manager and then to you."
      />
      <div className="p-4">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-4 gap-2">
            {CHANNELS.map((ch) => (
              <Node key={ch} label={channelMeta[ch].label} className="border-dashed" />
            ))}
          </div>

          <Connector active={working} />
          <Node
            label="Assistant"
            sub="reads, replies, takes the order"
            active={working}
            tone="machine"
          />
          <Connector active={working} />
          <Node
            label="Your guardrails"
            sub="checked before anything happens"
            active={working}
          />
          <Connector active={escalating} />
          <Node
            label="Manager"
            sub="approves what it cannot decide"
            active={escalating}
            tone="person"
          />
          <Connector active={escalating} />
          <Node
            label="You"
            sub="the final say"
            active={escalating}
            tone="person"
          />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
          The Assistant never writes to a channel or an order directly. Every action
          is a proposal that passes your rules first, so a blocked call is recorded
          next to everything that went through.
        </p>
      </div>
    </Panel>
  );
}

/* --------------------------------- Page ---------------------------------- */

export default function AgentsPage() {
  const [selectedId, setSelectedId] = React.useState("assistant");
  const [created, setCreated] = React.useState<AgentDef[]>([]);
  const [configs, setConfigs] = React.useState<Record<string, Config>>(initialConfigs);
  const [pristine, setPristine] = React.useState<Record<string, Config>>(initialConfigs);
  const [pages, setPages] = React.useState<Record<string, string | undefined>>(() =>
    Object.fromEntries(agents.map((a) => [a.id, a.page]))
  );

  const roster = React.useMemo(() => [...agents, ...created], [created]);

  const selected = roster.find((a) => a.id === selectedId) ?? assistant;

  const agentNames = React.useMemo(() => {
    const names: Record<string, string> = {};
    for (const a of roster) names[a.id] = a.name;
    return names;
  }, [roster]);

  const takenPages = React.useMemo(
    () => new Set(Object.values(pages).filter((p): p is string => Boolean(p))),
    [pages]
  );
  const freePages = facebookPages.filter((p) => !takenPages.has(p.id));

  const isDirty = (id: string) =>
    JSON.stringify(configs[id]) !== JSON.stringify(pristine[id]);

  const patchFor = (id: string) => (patch: Partial<Config>) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const resetFor = (id: string) => () =>
    setConfigs((prev) => ({ ...prev, [id]: { ...pristine[id] } }));

  const createAgent = (name: string, pageId?: string) => {
    const id = `agent-${created.length + 1}`;
    const initials =
      name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AG";
    const def: AgentDef = {
      id,
      name,
      initials,
      title: "Answers everything on its page",
      focus:
        "Replies to comments and DMs on its page, quotes live stock, takes the order, and hands off anything that needs a person.",
      escalation:
        "Anything your rules hold for approval, or a customer who asks for a person.",
      status: pageId ? "online" : "idle",
      tools: [...assistant.tools],
      handlesNow: 0,
      kpis: { resolved: 0, containment: 0, avgResponse: "-", handoffs: 0 },
      tone: "warm",
      languagePolicy: "mirror",
      systemPrompt: "",
    };
    setCreated((prev) => [...prev, def]);
    setConfigs((prev) => ({ ...prev, [id]: defaultConfig() }));
    setPristine((prev) => ({ ...prev, [id]: defaultConfig() }));
    setPages((prev) => ({ ...prev, [id]: pageId }));
    setSelectedId(id);
    toast.success(`${name} added`, {
      description: pageId
        ? `Connected to ${pageById(pageId)?.name}. Set its tone and brief below.`
        : "Connect a page when you are ready.",
    });
  };

  const connectPage = (id: string) => (pageId: string) => {
    setPages((prev) => ({ ...prev, [id]: pageId }));
    setCreated((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "online" } : a))
    );
    toast.success(`Page connected`, {
      description: `${pageById(pageId)?.name} is now answered by ${agentNames[id]}.`,
    });
  };

  const disconnectPage = (id: string) => () => {
    const pageId = pages[id];
    const page = pageId ? pageById(pageId) : undefined;
    setPages((prev) => ({ ...prev, [id]: undefined }));
    setCreated((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "idle" } : a))
    );
    toast("Page disconnected", {
      description: page
        ? `${agentNames[id]} no longer sees messages from ${page.name}.`
        : `Nothing to disconnect.`,
    });
  };

  return (
    <div className="space-y-5">
      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="how">How it works</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            <div className="space-y-4">
              <Roster
                list={roster}
                selectedId={selected.id}
                onSelect={setSelectedId}
                pagesOf={pages}
                freePages={freePages}
                onCreate={createAgent}
              />
              <ChannelConnect />
            </div>
            {selected.id === "manager" ? (
              <ManagerDetail />
            ) : (
              <AgentSettings
                key={selected.id}
                agent={selected}
                config={configs[selected.id]}
                onChange={patchFor(selected.id)}
                onReset={resetFor(selected.id)}
                dirty={isDirty(selected.id)}
                page={pages[selected.id]}
                agentName={agentNames[selected.id]}
                assignedTo={pages}
                onConnectPage={connectPage(selected.id)}
                onDisconnectPage={disconnectPage(selected.id)}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="how">
          <Orchestration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
