"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, CornerDownLeft, Package, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  conversationStatusMeta,
  conversations,
  formatBDT,
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
  type ConsoleResult,
  type ConsoleTurn,
} from "@/lib/console";
import {
  ChannelBadge,
  Chip,
  Metric,
  MetricRow,
  Mono,
  Panel,
  PanelHeader,

} from "@/components/primitives";

/* ------------------------------ Result cards ------------------------------ */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  );
}

function ResultCard({ result }: { result: ConsoleResult }) {
  if (result.kind === "order") {
    const o = result.order;
    return (
      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center gap-2">
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
        <Link
          href={`/admin/orders?order=${o.id}`}
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
        >
          Open it <ArrowUpRight className="size-3" />
        </Link>
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
    const p = result.kind === "product" ? result.product : result.product;
    return (
      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{p.name}</span>
          {result.kind === "added" ? (
            <Chip tone="bg-live-soft text-live-ink">
              <Check className="size-2.5" strokeWidth={3} />
              Added
            </Chip>
          ) : null}
        </div>
        <div className="mt-2">
          <Row label="Price" value={formatBDT(p.price)} />
          <Row label="In stock" value={`${p.stock}`} />
          {p.sizes.length ? <Row label="Sizes" value={p.sizes.join(", ")} /> : null}
        </div>
        {result.kind === "added" ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Your assistant can quote it from now on. Add colours and fabric on the
            Products page whenever you like.
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
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border bg-card p-3">
          <div className="text-[11px] text-muted-foreground">In your hand</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
            {formatBDT(result.today)}
          </div>
        </div>
        <div className="rounded-md border bg-card p-3">
          <div className="text-[11px] text-muted-foreground">Courier owes you</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
            {formatBDT(result.owed)}
          </div>
        </div>
        <div className="rounded-md border bg-card p-3">
          <div className="text-[11px] text-muted-foreground">Orders</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
            {result.orders}
          </div>
        </div>
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
        <Link
          href={`/admin/inbox?thread=${result.id}`}
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
        >
          Open the conversation <ArrowUpRight className="size-3" />
        </Link>
      </div>
    );
  }

  if (result.kind === "rule") {
    return (
      <div className="rounded-md border border-live/40 bg-live-soft p-3">
        <p className="text-[13px] leading-relaxed">
          <span className="text-live-ink">If the assistant tries to </span>
          <span className="font-medium">
            refund an order
          </span>
          <span className="text-live-ink"> {result.rule.condition}, </span>
          <span className="font-medium">
            {result.rule.outcome === "block" ? "don't let it" : "ask me first"}
          </span>
        </p>
        <Link
          href="/admin/guardrails"
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
        >
          See all your rules <ArrowUpRight className="size-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card p-3">
      <p className="text-[13px]">
        I did not understand that one. Try one of these.
      </p>
    </div>
  );
}

/* -------------------------------- Console --------------------------------- */

function Console({
  products,
  onProducts,
}: {
  products: Product[];
  onProducts: (next: Product[]) => void;
}) {
  const [input, setInput] = React.useState("");
  const [turns, setTurns] = React.useState<ConsoleTurn[]>([]);
  const nextId = React.useRef(1);

  const run = (raw: string) => {
    const asked = raw.trim();
    if (!asked) return;
    const result = interpret(asked, { products, orders: seedOrders });

    // Actions that change something, change it.
    if (result.kind === "stock") {
      onProducts(
        products.map((p) =>
          p.id === result.product.id
            ? {
                ...p,
                stock: result.to,
                status:
                  result.to === 0
                    ? "out-of-stock"
                    : result.to <= 8
                      ? "low-stock"
                      : "in-stock",
              }
            : p
        )
      );
    }
    if (result.kind === "added") onProducts([result.product, ...products]);

    setTurns((prev) => [{ id: nextId.current++, asked, result }, ...prev]);
    setInput("");
  };

  return (
    <Panel>
      <div className="p-4">
        <h1 className="text-lg font-semibold tracking-tight">
          What do you need?
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Type it the way you would say it. Add something, check an order, change
          how many you have left.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
          className="mt-3 flex gap-2"
        >
          <label htmlFor="ask" className="sr-only">
            What do you need?
          </label>
          <input
            id="ask"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="where is Rehana's order"
            autoComplete="off"
            className="h-11 flex-1 rounded-md border bg-background px-3 text-[15px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Ask
            <CornerDownLeft className="size-3.5" />
          </button>
        </form>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {examples.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => run(e)}
              className="rounded-full border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {turns.length ? (
        <ul className="divide-y border-t">
          {turns.map((t) => (
            <li key={t.id} className="animate-row-in space-y-2 px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium">{t.asked}</span>
                <span className="text-[11px] text-muted-foreground">
                  {summarise(t.result)}
                </span>
              </div>
              <ResultCard result={t.result} />
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function AskPage() {
  const [products, setProducts] = React.useState<Product[]>(seedProducts);

  const needsYou = conversations.filter(
    (c) => c.status === "awaiting-approval" || c.status === "with-human"
  );
  const inHand = seedOrders
    .filter((o) => o.paymentState === "settled")
    .reduce((n, o) => n + o.amount, 0);
  const owed = seedOrders
    .filter((o) => o.paymentState === "collected")
    .reduce((n, o) => n + o.amount, 0);
  const lowCount = products.filter((p) => p.stock <= 8).length;

  return (
    <div className="space-y-5">
      <Console products={products} onProducts={setProducts} />

      <MetricRow>
        <Metric label="Money in your hand" value={formatBDT(inHand)} basis="paid up front" />
        <Metric label="Courier owes you" value={formatBDT(owed)} basis="cash collected" />
        <Metric label="Running low" value={lowCount} basis="restock these" />
        <Metric label="Waiting on you" value={needsYou.length} basis="nothing else needs you" />
      </MetricRow>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Waiting on you"
            description="Your assistant stopped and asked."
          />
          <ul className="divide-y">
            {needsYou.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium">
                        {c.customer}
                      </span>
                      <ChannelBadge channel={c.channel} withLabel={false} />
                    </div>
                    <p className="mt-1 text-[12px] text-muted-foreground">{c.intent}</p>
                  </div>
                  <Chip tone={conversationStatusMeta[c.status].tone}>
                    {conversationStatusMeta[c.status].label}
                  </Chip>
                </div>
                <Link
                  href={`/admin/inbox?thread=${c.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
                >
                  Have a look <ArrowUpRight className="size-3" />
                </Link>
              </li>
            ))}
            {!needsYou.length ? (
              <li className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                Nothing needs you right now.
              </li>
            ) : null}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader
            title="Going out today"
            description="Orders on their way to someone."
          />
          <ul className="divide-y">
            {seedOrders
              .filter((o) => o.status === "shipped" || o.status === "processing")
              .slice(0, 5)
              .map((o) => (
                <li key={o.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Truck className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {o.customer}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {o.area} · {o.courier}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[13px] font-medium tabular-nums">
                    {formatBDT(o.amount)}
                  </span>
                </li>
              ))}
          </ul>
          <div className="border-t px-4 py-2.5">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-[12px] font-medium underline-offset-4 hover:underline"
            >
              <Package className="size-3" />
              All orders
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
