"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Languages,
  Send,
  UserRound,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  actionLabel,
  agentById,
  conversationStatusMeta,
  conversations,
  formatBDT,
  humanTeam,
  langTag,
  orderDraftDemo,
  orders,
  outcomeMeta,
  productById,
  sentimentMeta,
  type Conversation,
  type Message,
} from "@/lib/data";
import {
  AgentBadge,
  ChannelBadge,
  Chip,
  ConfidenceBar,
  LanguageChip,
  Mono,
  Panel,
  StatusDot,
} from "@/components/primitives";

/* ------------------------------ Thread list ------------------------------ */

const FILTERS = ["All", "Needs a person", "Agent handling", "Resolved"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(c: Conversation, f: Filter) {
  if (f === "All") return true;
  if (f === "Needs a person")
    return c.status === "awaiting-approval" || c.status === "with-human";
  if (f === "Agent handling") return c.status === "active";
  return c.status === "resolved";
}

function ThreadList({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = React.useState<Filter>("All");
  const shown = conversations.filter((c) => matchesFilter(c, filter));

  return (
    <Panel className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b p-2">
        {FILTERS.map((f) => {
          const count = conversations.filter((c) => matchesFilter(c, f)).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {f}
              <span
                className={cn(
                  "font-mono tabular-nums",
                  filter === f ? "text-background/60" : "text-muted-foreground/70"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
        {shown.map((c) => {
          const active = c.id === selected;
          const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full flex-col gap-1.5 px-3 py-2.5 text-left transition-colors",
                  active ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-medium">
                    {c.initials}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {c.customer}
                  </span>
                  {c.unread > 0 ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] tabular-nums text-background">
                      {c.unread}
                    </span>
                  ) : null}
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
                    {c.time}
                  </span>
                </div>

                <p className="line-clamp-1 pl-8 text-xs text-muted-foreground">
                  {last.text}
                </p>

                <div className="flex flex-wrap items-center gap-1 pl-8">
                  <ChannelBadge channel={c.channel} withLabel={false} />
                  <LanguageChip language={c.language} />
                  <Chip tone={sentimentMeta[c.sentiment].tone}>
                    {sentimentMeta[c.sentiment].label}
                  </Chip>
                  {c.status !== "active" ? (
                    <Chip tone={conversationStatusMeta[c.status].tone}>
                      {conversationStatusMeta[c.status].label}
                    </Chip>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* -------------------------------- Messages ------------------------------- */

function ToolCalls({ message }: { message: Message }) {
  const [open, setOpen] = React.useState(
    message.tools?.some((t) => t.outcome === "blocked") ?? false
  );
  if (!message.tools?.length) return null;

  const blocked = message.tools.filter((t) => t.outcome === "blocked").length;

  return (
    <div className="mt-1.5 overflow-hidden rounded-md border bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60"
      >
        <Wrench className="size-3 shrink-0 text-muted-foreground" />
        <span className="text-[11px] font-medium">
          {message.tools.length}{" "}
          {message.tools.length === 1 ? "action" : "actions"}
        </span>
        {blocked > 0 ? (
          <Chip tone="bg-block-soft text-block-ink">{blocked} blocked</Chip>
        ) : null}
        <ChevronDown
          className={cn(
            "ml-auto size-3 shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <ul className="divide-y border-t">
          {message.tools.map((t) => (
            <li key={t.id} className="px-2.5 py-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium">{actionLabel(t.tool)}</span>
                <Chip tone={outcomeMeta[t.outcome].tone}>
                  {outcomeMeta[t.outcome].label}
                </Chip>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
                  {t.latencyMs}ms
                </span>
              </div>
              <p
                className={cn(
                  "mt-0.5 text-[11px]",
                  t.outcome === "blocked" ? "text-block-ink" : "text-muted-foreground"
                )}
              >
                {t.detail}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MessageBubble({
  message,
  showGloss,
}: {
  message: Message;
  showGloss: boolean;
}) {
  if (message.author === "system") {
    return (
      <li className="flex justify-center py-1">
        <p className="max-w-lg rounded-md bg-muted px-2.5 py-1.5 text-center text-[11px] text-muted-foreground">
          {message.text}
        </p>
      </li>
    );
  }

  const isCustomer = message.author === "customer";
  const product = message.productRef ? productById(message.productRef) : undefined;

  return (
    <li className={cn("flex", isCustomer ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[min(38rem,85%)]", isCustomer ? "" : "text-right")}>
        <div
          className={cn(
            "mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground",
            isCustomer ? "" : "justify-end"
          )}
        >
          {message.author === "agent" && message.agent ? (
            <>
              <StatusDot className="bg-machine" />
              <AgentBadge agent={message.agent} />
              <span>agent</span>
            </>
          ) : null}
          {message.author === "human" ? (
            <>
              <UserRound className="size-3" />
              <span className="font-medium text-foreground">{message.humanName}</span>
              <span>person</span>
            </>
          ) : null}
          <span className="font-mono tabular-nums">{message.time}</span>
        </div>

        <div
          className={cn(
            "rounded-lg px-3 py-2 text-left text-[13px] leading-relaxed",
            isCustomer && "bg-muted",
            message.author === "agent" && "border bg-card",
            message.author === "human" && "bg-foreground text-background"
          )}
        >
          <p
            lang={langTag(message.language)}
            data-script={message.script === "bengali" ? "bengali" : undefined}
          >
            {message.text}
          </p>

          {showGloss && message.gloss ? (
            <p
              className={cn(
                "mt-1.5 border-t pt-1.5 text-[12px] italic",
                message.author === "human"
                  ? "border-background/20 text-background/70"
                  : "text-muted-foreground"
              )}
            >
              {message.gloss}
            </p>
          ) : null}

          {product ? (
            <Link
              href="/admin/orders"
              className={cn(
                "mt-2 flex items-center gap-2.5 rounded-md border p-2 transition-colors hover:bg-muted/50",
                message.author === "human" && "border-background/20"
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted font-mono text-[9px]">
                {product.id.slice(-4)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium">
                  {product.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {formatBDT(product.price)} · {product.stock} in stock
                </span>
              </span>
              <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
            </Link>
          ) : null}
        </div>

        {message.citations?.length ? (
          <div className="mt-1.5 space-y-1 text-left">
            {message.citations.map((c) => (
              <div
                key={c.doc}
                className="rounded-md border border-live/30 bg-live-soft/40 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="size-2.5 shrink-0 text-live" />
                  <span className="text-[11px] font-medium">{c.doc}</span>
                  <Mono className="text-[10px] text-muted-foreground">
                    {c.score.toFixed(2)}
                  </Mono>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {c.snippet}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="text-left">
          <ToolCalls message={message} />
        </div>

        {message.confidence !== undefined ? (
          <div className={cn("mt-1.5 flex", isCustomer ? "" : "justify-end")}>
            <ConfidenceBar value={message.confidence} label="confidence" />
          </div>
        ) : null}
      </div>
    </li>
  );
}

/* ------------------------------ Context rail ----------------------------- */

function ContextRail({ conversation }: { conversation: Conversation }) {
  const order = conversation.orderId
    ? orders.find((o) => o.id === conversation.orderId)
    : undefined;
  const assistantAgent = agentById("assistant");

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex items-center gap-2.5 border-b px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[11px] font-medium">
            {conversation.initials}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">
              {conversation.customer}
            </div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">
              {conversation.handle}
            </div>
          </div>
        </div>
        <dl className="divide-y text-[12px]">
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <dt className="text-muted-foreground">Channel</dt>
            <dd>
              <ChannelBadge channel={conversation.channel} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <dt className="text-muted-foreground">Came from</dt>
            <dd className="truncate text-right">{conversation.origin}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <dt className="text-muted-foreground">Handled by</dt>
            <dd>
              <AgentBadge agent={conversation.agent} />
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel>
        <div className="border-b px-4 py-2.5">
          <h3 className="text-[13px] font-medium">How it was classified</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {assistantAgent.name} scored this before writing back.
          </p>
        </div>
        <div className="space-y-2.5 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-muted-foreground">Intent</span>
            <span className="flex items-center gap-2">
              <span className="text-[12px] font-medium">{conversation.intent}</span>
              <ConfidenceBar value={conversation.intentConfidence} />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-muted-foreground">Language</span>
            <span className="flex items-center gap-2">
              <LanguageChip language={conversation.language} />
              <ConfidenceBar value={conversation.languageConfidence} />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-muted-foreground">Sentiment</span>
            <Chip tone={sentimentMeta[conversation.sentiment].tone}>
              {sentimentMeta[conversation.sentiment].label}
            </Chip>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <Clock className="size-3.5 text-muted-foreground" />
          <h3 className="text-[13px] font-medium">{conversation.window.label}</h3>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-muted-foreground">Closes in</span>
            <span className="font-mono text-[13px] font-medium tabular-nums">
              {conversation.window.remaining}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full",
                conversation.window.pct < 30 ? "bg-pend" : "bg-live"
              )}
              style={{ width: `${conversation.window.pct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {conversation.window.kind === "csw"
              ? "Outside this window only approved WhatsApp templates may be sent."
              : "Outside this window no automated message may be sent at all."}
          </p>
        </div>
      </Panel>

      {order ? (
        <Panel>
          <div className="border-b px-4 py-2.5">
            <h3 className="text-[13px] font-medium">Order in this thread</h3>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <Mono className="text-[12px] font-medium">{order.id}</Mono>
              <span className="font-mono text-[13px] font-medium tabular-nums">
                {formatBDT(order.amount)}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">{order.product}</p>
            <dl className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Courier</dt>
                <dd className="font-mono">{order.courier}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Tracking</dt>
                <dd className="font-mono">{order.tracking}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Zone</dt>
                <dd>{order.zone}</dd>
              </div>
            </dl>
            <Link
              href={`/admin/orders?order=${order.id}`}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
            >
              Open order
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

/* ------------------------------ Take the order ---------------------------- */

function TakeOrder({ customer }: { customer: string }) {
  const [flat, setFlat] = React.useState("");
  const [ringFirst, setRingFirst] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const total = orderDraftDemo.itemTotal + orderDraftDemo.deliveryCharge;

  if (done) {
    return (
      <div
        role="status"
        className="mx-4 mb-3 rounded-md border border-live/40 bg-live-soft px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <Check className="size-3.5 shrink-0 text-live" strokeWidth={3} />
          <span className="text-[13px] font-medium">Order created</span>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-live-ink">
          {formatBDT(total)} to {customer}, cash on delivery.
          {ringFirst ? " Flagged to ring before it ships." : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-3 overflow-hidden rounded-md border border-machine/40">
      <div className="border-b border-machine/25 bg-machine-soft px-3 py-2">
        <p className="text-[12px] font-medium text-machine-ink">
          They have sent their details
        </p>
        <p className="mt-0.5 text-[11px] text-machine-ink/85">
          Pulled out of their message. Check it before you create the order.
        </p>
      </div>

      <dl className="divide-y">
        {orderDraftDemo.fields.map((f) => (
          <div key={f.label} className="flex items-baseline gap-3 px-3 py-1.5">
            <dt className="w-16 shrink-0 text-[11px] text-muted-foreground">{f.label}</dt>
            <dd className="flex-1 text-[12px] font-medium">{f.value}</dd>
            {f.note ? (
              <dd className="shrink-0 text-[10px] text-muted-foreground">{f.note}</dd>
            ) : null}
          </div>
        ))}
      </dl>

      {orderDraftDemo.missing.map((m) => (
        <div key={m.question} className="border-t bg-pend-soft px-3 py-2">
          <label htmlFor="flat" className="text-[12px] font-medium text-pend-ink">
            {m.question}
          </label>
          <p className="mt-0.5 text-[11px] text-pend-ink/85">{m.why}</p>
          <input
            id="flat"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            placeholder="e.g. 5B"
            className="mt-1.5 h-8 w-28 rounded-md border bg-background px-2.5 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      ))}

      <div className="border-t px-3 py-2">
        <dl className="space-y-1 text-[12px]">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Item</dt>
            <dd className="font-mono tabular-nums">
              {formatBDT(orderDraftDemo.itemTotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="font-mono tabular-nums">
              {formatBDT(orderDraftDemo.deliveryCharge)}
            </dd>
          </div>
          <div className="flex justify-between border-t pt-1 font-medium">
            <dt>They pay the rider</dt>
            <dd className="font-mono tabular-nums">{formatBDT(total)}</dd>
          </div>
        </dl>

        <label className="mt-2.5 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={ringFirst}
            onChange={(e) => setRingFirst(e.target.checked)}
            className="mt-0.5 size-3.5 shrink-0 accent-foreground"
          />
          <span className="text-[11px] leading-relaxed">
            Ring her before it ships.{" "}
            <span className="text-muted-foreground">
              Unconfirmed cash orders are the ones that come back.
            </span>
          </span>
        </label>

        <button
          type="button"
          disabled={!flat.trim()}
          onClick={() => setDone(true)}
          className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Create the order
        </button>
        {!flat.trim() ? (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Add the flat first. A rider standing outside with no flat number is how
            a parcel comes back.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------------- Page ---------------------------------- */

function InboxInner() {
  const params = useSearchParams();
  const requested = params.get("thread");
  const [selected, setSelected] = React.useState(
    requested && conversations.some((c) => c.id === requested)
      ? requested
      : conversations[0].id
  );
  const [showGloss, setShowGloss] = React.useState(true);
  const [tookOver, setTookOver] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState("");
  /** Replies typed during this session, kept per thread. */
  const [sent, setSent] = React.useState<Record<string, Message[]>>({});

  // Follow a ?thread= change during client navigation without an effect round-trip.
  const [seenParam, setSeenParam] = React.useState(requested);
  if (requested !== seenParam) {
    setSeenParam(requested);
    if (requested && conversations.some((c) => c.id === requested)) {
      setSelected(requested);
    }
  }

  const conversation = conversations.find((c) => c.id === selected)!;
  const isHuman = tookOver.includes(conversation.id) || conversation.status === "with-human";

  return (
    <div className="grid h-[calc(100vh-8.5rem)] min-h-[34rem] grid-cols-1 gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)_18rem]">
      <div className="hidden min-h-0 lg:block">
        <ThreadList selected={selected} onSelect={setSelected} />
      </div>

      <Panel className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-medium">
            {conversation.initials}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">
              {conversation.customer}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Mono className="text-[10px]">{conversation.id}</Mono>
              <span>·</span>
              <span className="truncate">{conversation.intent}</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowGloss((v) => !v)}
              aria-pressed={showGloss}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition-colors",
                showGloss ? "bg-muted" : "hover:bg-muted"
              )}
              title="Show an English reading beneath Bangla and Banglish messages"
            >
              <Languages className="size-3" />
              English
            </button>
            <Chip tone={conversationStatusMeta[conversation.status].tone}>
              {conversationStatusMeta[conversation.status].label}
            </Chip>
          </div>
        </div>

        <ul className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {[...conversation.messages, ...(sent[selected] ?? [])].map((m) => (
            <MessageBubble key={m.id} message={m} showGloss={showGloss} />
          ))}
        </ul>

        {!conversation.orderId && conversation.id === "CV-222" ? (
          <TakeOrder customer={conversation.customer} />
        ) : null}

        <div className="shrink-0 border-t p-3">
          {isHuman ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = draft.trim();
                if (!text) return;
                const now = new Date();
                setSent((prev) => ({
                  ...prev,
                  [selected]: [
                    ...(prev[selected] ?? []),
                    {
                      id: `you-${(prev[selected]?.length ?? 0) + 1}`,
                      author: "human",
                      humanName: humanTeam[0].name,
                      text,
                      time: `${String(now.getHours()).padStart(2, "0")}:${String(
                        now.getMinutes()
                      ).padStart(2, "0")}`,
                    },
                  ],
                }));
                setDraft("");
              }}
              className="flex items-end gap-2"
            >
              <label htmlFor="reply" className="sr-only">
                Write a reply to {conversation.customer}
              </label>
              <textarea
                id="reply"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder={`Reply to ${conversation.customer.split(" ")[0]}…`}
                className="max-h-28 min-h-9 flex-1 resize-none rounded-md border bg-background px-2.5 py-2 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="size-3.5" />
                Send
              </button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-2">
                <StatusDot className="bg-machine" pulse />
                <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                  {agentById(conversation.agent).name} is handling this thread
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTookOver((prev) => [...prev, conversation.id])}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Check className="size-3.5" />
                Take over
              </button>
            </div>
          )}
          {isHuman ? (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Assigned to</span>
              <span className="font-medium text-foreground">
                {conversation.messages.find((m) => m.humanName)?.humanName ??
                  humanTeam[0].name}
              </span>
            </div>
          ) : null}
        </div>
      </Panel>

      <div className="hidden min-h-0 overflow-y-auto xl:block">
        <ContextRail conversation={conversation} />
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-8.5rem)] animate-pulse rounded-lg border bg-card" />
      }
    >
      <InboxInner />
    </Suspense>
  );
}
