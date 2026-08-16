/**
 * The typing console.
 *
 * The person using this has never used business software. Nine screens with
 * their own vocabulary is a lot to learn; one box you type into is not. So she
 * says what she wants in her own words and this works out what she meant.
 *
 * Everything here runs against the real demo data. Ask for an order and it
 * finds that order. Change stock and the number changes. Nothing is faked,
 * because a console that only pretends to work is worse than no console.
 */

import {
  conversations,
  formatBDT,
  type Guardrail,
  type Order,
  type Product,
} from "@/lib/data";

export type ConsoleResult =
  | { kind: "order"; order: Order }
  | { kind: "customer"; name: string; orders: Order[] }
  | { kind: "product"; product: Product }
  | { kind: "stock"; product: Product; from: number; to: number }
  | { kind: "added"; product: Product }
  | { kind: "money"; today: number; owed: number; orders: number }
  | { kind: "low"; items: Product[] }
  | { kind: "thread"; name: string; intent: string; id: string }
  | { kind: "rule"; rule: Guardrail }
  | { kind: "unsure"; heard: string };

export interface ConsoleTurn {
  id: number;
  asked: string;
  result: ConsoleResult;
}

/** Things she can type, shown as chips so she never has to guess the syntax. */
export const examples = [
  "where is Rehana's order",
  "how much did I sell today",
  "what is running low",
  "Chaya kurti 20 pieces left",
  "add nokshi kurti 1450 taka 12 pieces",
  "never refund more than 3000 taka",
];

const digits = (s: string) => s.replace(/[^0-9]/g, "");

/** Loose match on a product name: any word she typed that appears in the name. */
function findProduct(text: string, list: Product[]): Product | undefined {
  const words = text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  let best: { p: Product; hits: number } | undefined;
  for (const p of list) {
    const name = p.name.toLowerCase();
    const hits = words.filter((w) => name.includes(w)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { p, hits };
  }
  return best?.p;
}

function findOrder(text: string, list: Order[]): Order | undefined {
  const byId = text.match(/ord[-\s]?(\d{3,})/i);
  if (byId) {
    const hit = list.find((o) => digits(o.id).endsWith(byId[1]));
    if (hit) return hit;
  }
  const phone = digits(text);
  if (phone.length >= 6) {
    const hit = list.find((o) => digits(o.phone).includes(phone));
    if (hit) return hit;
  }
  return undefined;
}

function findCustomer(text: string, list: Order[]): Order[] {
  const words = text.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
  const hits = list.filter((o) =>
    words.some((w) => o.customer.toLowerCase().includes(w))
  );
  return hits;
}

export interface ConsoleContext {
  products: Product[];
  orders: Order[];
}

/**
 * Works out what she meant. Order matters: the most specific reading wins, so
 * "chaya kurti 20 pieces left" is a stock change rather than a product search.
 */
export function interpret(input: string, ctx: ConsoleContext): ConsoleResult {
  const text = input.trim();
  const low = text.toLowerCase();

  // Money.
  if (/(sold|sell|sale|revenue|taka|income|koto.*(bikri|taka))/.test(low) &&
      /(today|aaj|day|month)/.test(low)) {
    const paid = ctx.orders.filter((o) => o.paymentState === "settled");
    const held = ctx.orders.filter((o) => o.paymentState === "collected");
    return {
      kind: "money",
      today: paid.reduce((n, o) => n + o.amount, 0),
      owed: held.reduce((n, o) => n + o.amount, 0),
      orders: paid.length + held.length,
    };
  }

  // Running low.
  if (/(low|running out|kom|finish|restock|out of stock|shesh)/.test(low)) {
    return {
      kind: "low",
      items: ctx.products.filter((p) => p.stock <= 8).sort((a, b) => a.stock - b.stock),
    };
  }

  // A new rule.
  const amount = low.match(/(\d{3,6})/);
  if (/(never|don'?t|do not|dont|only|max|maximum|limit)/.test(low) &&
      /refund|ferot|taka/.test(low) && amount) {
    return {
      kind: "rule",
      rule: {
        id: `G-${amount[1]}`,
        action: "refund",
        condition: `more than ৳${Number(amount[1]).toLocaleString("en-IN")}`,
        threshold: Number(amount[1]),
        outcome: /never|do not|don'?t|dont/.test(low) ? "block" : "ask",
        enabled: true,
        stoppedThisWeek: 0,
      },
    };
  }

  // Add a new product: a name, a price, and usually a count.
  if (/^(add|notun|new)\b/.test(low)) {
    const nums = low.match(/\d+/g)?.map(Number) ?? [];
    const price = nums.find((n) => n >= 100) ?? 0;
    const stock = nums.find((n) => n < 100) ?? 0;
    const name = text
      .replace(/^(add|notun|new)\s+/i, "")
      .replace(/\d+/g, "")
      .replace(/\b(taka|tk|৳|pcs|pieces|piece|ta|stock)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (name && price) {
      return {
        kind: "added",
        product: {
          id: `P-${1500 + Math.min(99, stock)}`,
          name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
          category: /saree/i.test(name) ? "Saree" : /kurti/i.test(name) ? "Kurti" : "Other",
          price,
          stock,
          sizes: ["M", "L", "XL"],
          colours: [],
          material: "",
          status: stock === 0 ? "out-of-stock" : stock <= 8 ? "low-stock" : "in-stock",
          sold: 0,
          addedVia: "manual",
          addedOn: "today",
        },
      };
    }
  }

  // Change stock: a product plus a count, with a stock-ish word.
  const count = low.match(/(\d{1,4})\s*(pcs|pieces|piece|ta|left|stock|baki|ache)?/);
  if (/(stock|left|piece|pcs|baki|ache)/.test(low)) {
    const p = findProduct(text, ctx.products);
    if (p && count) {
      const to = Number(count[1]);
      if (!Number.isNaN(to) && to !== p.stock) {
        return { kind: "stock", product: p, from: p.stock, to };
      }
    }
  }

  // A specific order.
  const order = findOrder(text, ctx.orders);
  if (order) return { kind: "order", order };

  // A customer by name.
  if (/(order|where|kothay|delivery|parcel|status)/.test(low) || /^[a-z\s']+$/i.test(low)) {
    const hits = findCustomer(text, ctx.orders);
    if (hits.length === 1) return { kind: "order", order: hits[0] };
    if (hits.length > 1) {
      return { kind: "customer", name: hits[0].customer.split(" ")[0], orders: hits };
    }
  }

  // No order, but she may still be mid-conversation with them.
  const words = low.split(/[^a-z]+/).filter((w) => w.length > 2);
  const thread = conversations.find((c) =>
    words.some((w) => c.customer.toLowerCase().includes(w))
  );
  if (thread) {
    return {
      kind: "thread",
      name: thread.customer,
      intent: thread.intent,
      id: thread.id,
    };
  }

  // A product she is asking about.
  const p = findProduct(text, ctx.products);
  if (p) return { kind: "product", product: p };

  return { kind: "unsure", heard: text };
}

/** One plain sentence describing what it did, shown above the result. */
export function summarise(r: ConsoleResult): string {
  switch (r.kind) {
    case "order":
      return `${r.order.customer}, ${formatBDT(r.order.amount)}`;
    case "customer":
      return `${r.orders.length} orders for ${r.name}`;
    case "product":
      return `${r.product.name}, ${r.product.stock} left`;
    case "stock":
      return `${r.product.name} changed from ${r.from} to ${r.to}`;
    case "added":
      return `${r.product.name} added at ${formatBDT(r.product.price)}`;
    case "money":
      return `${formatBDT(r.today)} in your hand`;
    case "low":
      return r.items.length
        ? `${r.items.length} things running low`
        : "Nothing is running low";
    case "thread":
      return "No order yet";
    case "rule":
      return "New rule added";
    case "unsure":
      return "Not sure what you meant";
  }
}
