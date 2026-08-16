"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, CornerDownLeft, Mic, Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  conversations,
  formatBDT,
  langTag,
  orderStatusMeta,
  orders as seedOrders,
  paymentStateMeta,
  products as seedProducts,
  type Product,
} from "@/lib/data";
import {
  examples,
  interpret,
  summarise,
  voiceLines,
  type ConsoleResult,
} from "@/lib/console";
import { Chip, Mono, Panel } from "@/components/primitives";

/*
 * The Ask page is one conversation with the shop, in the visual grammar of the
 * messaging apps the seller already uses all day. No metric cards, no side
 * panels: numbers arrive as sentences, changes confirm in the thread with an
 * undo, and yesterday's answers scroll up into the record.
 */

interface Turn {
  id: number;
  asked: string;
  result?: ConsoleResult;
  undone?: boolean;
}

const stockStatus = (n: number): Product["status"] =>
  n === 0 ? "out-of-stock" : n <= 8 ? "low-stock" : "in-stock";

/* ------------------------------ Result cards ------------------------------ */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  );
}

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
    >
      {children} <ArrowUpRight className="size-3" />
    </Link>
  );
}

function ResultCard({ result }: { result: ConsoleResult }) {
  if (result.kind === "order") {
    const o = result.order;
    return (
      <div className="rounded-md border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Mono className="text-[13px] font-medium">{o.id}</Mono>
          <Chip tone={orderStatusMeta[o.status].tone}>
            {orderStatusMeta[o.status].label}
          </Chip>
          <Chip tone={paymentStateMeta[o.paymentState].tone}>
            {paymentStateMeta[o.paymentState].label}
          </Chip>
        </div>
        <div className="mt-2">
          <Row label="Item" value={`${o.product} × ${o.qty}`} />
          <Row label="Amount" value={formatBDT(o.amount)} />
          <Row label="Going to" value={o.area} />
          <Row label="Courier" value={`${o.courier} · ${o.tracking}`} />
          <Row
            label="Rung to confirm"
            value={o.confirmedByCall ? "Yes" : "Not yet"}
          />
        </div>
        <CardLink href={`/admin/orders?order=${o.id}`}>Open it</CardLink>
      </div>
    );
  }

  if (result.kind === "customer") {
    return (
      <div className="rounded-md border bg-card">
        <ul className="divide-y">
          {result.orders.map((o) => (
            <li key={o.id} className="flex items-center gap-3 px-3 py-2">
              <Mono className="text-[12px] font-medium">{o.id}</Mono>
              <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                {o.product}
              </span>
              <span className="font-mono text-[12px] tabular-nums">
                {formatBDT(o.amount)}
              </span>
              <Chip tone={orderStatusMeta[o.status].tone}>
                {orderStatusMeta[o.status].label}
              </Chip>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (result.kind === "product" || result.kind === "added") {
    const p = result.product;
    return (
      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{p.name}</span>
          {result.kind === "added" ? (
            <Chip tone="bg-live-soft text-live-ink">
              <Check className="size-2.5" strokeWidth={3} />
              In your shop
            </Chip>
          ) : null}
        </div>
        <div className="mt-2">
          <Row label="Price" value={formatBDT(p.price)} />
          <Row label="In stock" value={`${p.stock}`} />
          {p.sizes.length ? <Row label="Sizes" value={p.sizes.join(", ")} /> : null}
        </div>
        {result.kind === "added" ? (
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Customers who ask about it will get an answer right away. Add colours
            and fabric on the Products page whenever you like.
          </p>
        ) : null}
      </div>
    );
  }

  if (result.kind === "stock") {
    return (
      <div className="rounded-md border border-live/40 bg-live-soft p-3">
        <div className="flex items-center gap-2">
          <Check className="size-3.5 shrink-0 text-live" strokeWidth={3} />
          <span className="text-[13px] font-medium">{result.product.name}</span>
        </div>
        <p className="mt-1.5 text-[13px] text-live-ink">
          <span className="font-mono line-through opacity-60">{result.from}</span>{" "}
          <span className="font-mono font-semibold">{result.to}</span> in stock.
        </p>
      </div>
    );
  }

  if (result.kind === "money") {
    return (
      <div className="rounded-md border bg-card p-3 text-[13px] leading-relaxed">
        <p>
          You have{" "}
          <Mono className="font-semibold">{formatBDT(result.today)}</Mono> in
          hand from paid orders.
        </p>
        <p className="mt-1 text-muted-foreground">
          The courier is holding <Mono>{formatBDT(result.owed)}</Mono> more. It
          reaches you after they deliver.{" "}
          <span className="font-mono tabular-nums">{result.orders}</span> orders
          altogether.
        </p>
      </div>
    );
  }

  if (result.kind === "low") {
    if (!result.items.length) {
      return (
        <div className="rounded-md border bg-card p-3 text-[13px]">
          Nothing is running low.
        </div>
      );
    }
    return (
      <div className="rounded-md border bg-card">
        <ul className="divide-y">
          {result.items.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-[13px]">{p.name}</span>
              <span
                className={cn(
                  "font-mono text-[13px] font-medium tabular-nums",
                  p.stock === 0 ? "text-block-ink" : "text-pend-ink"
                )}
              >
                {p.stock}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (result.kind === "thread") {
    return (
      <div className="rounded-md border bg-card p-3">
        <p className="text-[13px]">
          <span className="font-medium">{result.name}</span> has not ordered yet.
          You are still talking about {result.intent.toLowerCase()}.
        </p>
        <CardLink href={`/admin/inbox?thread=${result.id}`}>
          Open the conversation
        </CardLink>
      </div>
    );
  }

  if (result.kind === "rule") {
    return (
      <div className="rounded-md border border-live/40 bg-live-soft p-3">
        <p className="text-[13px] leading-relaxed">
          <span className="text-live-ink">If the assistant tries to </span>
          <span className="font-medium">refund an order</span>
          <span className="text-live-ink"> {result.rule.condition}, </span>
          <span className="font-medium">
            {result.rule.outcome === "block" ? "don't let it" : "ask me first"}
          </span>
        </p>
        <CardLink href="/admin/guardrails">See all your rules</CardLink>
      </div>
    );
  }

  if (result.kind === "assistant") {
    return (
      <div className="rounded-md border border-live/40 bg-live-soft p-3">
        <div className="flex items-center gap-2">
          <Check className="size-3.5 shrink-0 text-live" strokeWidth={3} />
          <span className="text-[13px] font-medium">Your assistant updated</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-live-ink">
          {result.change === "tone"
            ? `From the next reply it will sound ${result.value}.`
            : result.change === "language"
              ? `It will reply in ${result.value} from now on.`
              : `It will remember: “${result.value}”`}
        </p>
        <CardLink href="/admin/agents">See your assistant</CardLink>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card p-3">
      <p className="text-[13px] leading-relaxed">
        I did not catch that one. Try saying it like the suggestions under the
        box.
      </p>
    </div>
  );
}

/* --------------------------------- Page ----------------------------------- */

const thinkingLine = (asked: string) => {
  const low = asked.toLowerCase();
  if (/\b(assistant|agent|bot)\b/.test(low)) return "Telling your assistant…";
  if (/(order|kothay|delivery|parcel)/.test(low)) return "Checking your orders…";
  if (/(taka|sold|sell|pelam|money)/.test(low)) return "Counting your money…";
  if (/(stock|piece|pcs|ache|low|add)/.test(low)) return "Checking your stock…";
  return "One moment…";
};

export default function AskPage() {
  const [products, setProducts] = React.useState<Product[]>(seedProducts);
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [busyLine, setBusyLine] = React.useState<string | null>(null);
  const [listening, setListening] = React.useState(false);

  const productsRef = React.useRef(seedProducts);
  const busyRef = React.useRef(false);
  const nextId = React.useRef(1);
  const voiceIndex = React.useRef(0);
  const threadRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateProducts = (next: Product[]) => {
    productsRef.current = next;
    setProducts(next);
  };

  const run = (raw: string) => {
    const asked = raw.trim();
    if (!asked || busyRef.current) return;
    busyRef.current = true;
    const id = nextId.current++;
    setInput("");
    setTurns((prev) => [...prev, { id, asked }]);
    setBusyLine(thinkingLine(asked));
    window.setTimeout(() => {
      const result = interpret(asked, {
        products: productsRef.current,
        orders: seedOrders,
      });
      if (result.kind === "stock") {
        updateProducts(
          productsRef.current.map((p) =>
            p.id === result.product.id
              ? { ...p, stock: result.to, status: stockStatus(result.to) }
              : p
          )
        );
      }
      if (result.kind === "added") {
        updateProducts([result.product, ...productsRef.current]);
      }
      busyRef.current = false;
      setBusyLine(null);
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, result } : t)));
    }, 700);
  };

  const undo = (turn: Turn) => {
    const r = turn.result;
    if (!r || turn.undone) return;
    if (r.kind === "stock") {
      updateProducts(
        productsRef.current.map((p) =>
          p.id === r.product.id
            ? { ...p, stock: r.from, status: stockStatus(r.from) }
            : p
        )
      );
    }
    if (r.kind === "added") {
      updateProducts(productsRef.current.filter((p) => p.id !== r.product.id));
    }
    setTurns((prev) =>
      prev.map((t) => (t.id === turn.id ? { ...t, undone: true } : t))
    );
  };

  const dictate = () => {
    if (listening || busyRef.current) return;
    const line = voiceLines[voiceIndex.current++ % voiceLines.length];
    setListening(true);
    window.setTimeout(() => {
      setListening(false);
      setInput(line);
      window.setTimeout(() => run(line), 500);
    }, 900);
  };

  // Keep the newest message in view, like any chat.
  const turnCount = turns.length;
  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turnCount, busyLine]);

  const inHand = seedOrders
    .filter((o) => o.paymentState === "settled")
    .reduce((n, o) => n + o.amount, 0);
  const held = seedOrders.filter((o) => o.paymentState === "collected");
  const owed = held.reduce((n, o) => n + o.amount, 0);
  const needsYou = conversations.filter(
    (c) => c.status === "awaiting-approval" || c.status === "with-human"
  );
  const lowest = [...products]
    .filter((p) => p.stock <= 8)
    .sort((a, b) => a.stock - b.stock)[0];

  const empty = turns.length === 0 && !busyLine;

  return (
    <>
      <h1 className="sr-only">Ask</h1>
      <Panel className="flex h-[calc(100dvh-6.5rem)] min-h-[28rem] flex-col overflow-hidden">
        <div ref={threadRef} className="flex-1 overflow-y-auto p-4">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-xl font-semibold tracking-tight">
                What do you need?
              </p>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Ask in Bangla, Banglish or English, the way you would say it out
                loud.
              </p>

              <div className="mt-7 max-w-md space-y-2 text-[13px] leading-relaxed">
                <p>
                  You have{" "}
                  <Mono className="font-semibold">{formatBDT(inHand)}</Mono> in
                  hand. The courier will send you <Mono>{formatBDT(owed)}</Mono>{" "}
                  from {held.length} deliveries.
                </p>
                <p className="text-muted-foreground">
                  {lowest ? (
                    <>
                      {lowest.name} is{" "}
                      <button
                        type="button"
                        onClick={() => run("what is running low")}
                        className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                      >
                        {lowest.stock === 0
                          ? "sold out"
                          : `almost sold out, ${lowest.stock} left`}
                      </button>
                      .{" "}
                    </>
                  ) : null}
                  {needsYou.length > 0 ? (
                    <>
                      <Link
                        href="/admin/inbox"
                        className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                      >
                        {needsYou.length === 1
                          ? "1 customer is waiting for your reply"
                          : `${needsYou.length} customers are waiting for your reply`}
                      </Link>
                      .
                    </>
                  ) : (
                    "No one is waiting on you right now."
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="flex justify-center">
                <Chip>Today</Chip>
              </div>

              {turns.map((t) => (
                <div key={t.id} className="space-y-3">
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-lg rounded-br-sm border bg-muted px-3 py-2 text-[13px]">
                      {t.asked}
                    </p>
                  </div>

                  {t.result ? (
                    <div className="animate-row-in flex justify-start">
                      <div className="w-full max-w-[92%] space-y-1.5 sm:max-w-[85%]">
                        {/* Cards that carry their own headline do not need the
                            speech line repeated above them. */}
                        {t.result.kind !== "unsure" &&
                        t.result.kind !== "assistant" ? (
                          <p className="text-[12px] text-muted-foreground">
                            {summarise(t.result)}
                          </p>
                        ) : null}
                        <ResultCard result={t.result} />
                        {(t.result.kind === "stock" ||
                          t.result.kind === "added") &&
                          (t.undone ? (
                            <p className="text-[12px] text-muted-foreground">
                              Undone. Everything is back the way it was.
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => undo(t)}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                            >
                              <Undo2 className="size-3" />
                              Undo this
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {busyLine ? (
                <div className="flex justify-start">
                  <p className="animate-pulse rounded-lg rounded-bl-sm border bg-card px-3 py-2 text-[13px] text-muted-foreground">
                    {busyLine}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap gap-1.5">
              {examples.map((e) => (
                <button
                  key={e.text}
                  type="button"
                  lang={e.language ? langTag(e.language) : undefined}
                  onClick={() => {
                    setInput(e.text);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {e.text}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
              }}
              className="mt-2 flex gap-2"
            >
              <label htmlFor="ask" className="sr-only">
                What do you need?
              </label>
              <input
                id="ask"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="where is Rehana's order"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-md border bg-background px-3 text-[15px] outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <button
                type="button"
                onClick={dictate}
                aria-label="Say it instead"
                aria-pressed={listening}
                title="Say it instead"
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border transition-colors hover:bg-muted",
                  listening && "animate-pulse border-live text-live-ink"
                )}
              >
                <Mic className="size-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Ask
                <CornerDownLeft className="size-3.5" />
              </button>
            </form>
            {listening ? (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Listening…
              </p>
            ) : null}
          </div>
        </div>
      </Panel>
    </>
  );
}
