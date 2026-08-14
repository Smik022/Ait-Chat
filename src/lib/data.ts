/**
 * The demonstration world for Ait-Chat.
 *
 * Every merchant, customer, conversation, order and number below is illustrative.
 * Nothing here is a live integration or a real customer. Industry figures that come
 * from the research/ folder are marked as benchmarks and never as achieved results.
 */

export type Channel = "instagram" | "facebook" | "whatsapp" | "web";

export type AgentRole =
  | "router"
  | "sales"
  | "support"
  | "retention"
  | "operations"
  | "manager";

export type Language = "banglish" | "bangla" | "english";

export type Sentiment = "positive" | "neutral" | "negative";

export type Outcome = "allowed" | "blocked" | "approved" | "fallback";

/* ------------------------------- Merchant -------------------------------- */

export const merchant = {
  name: "Athelier",
  handle: "@athelier",
  category: "Women's wear · Handloom",
  city: "Dhaka",
  /** A page and a phone number. There is no website and no storefront. */
  page: "facebook.com/athelier",
  whatsapp: "+880 1XXX-XXXXXX",
};

export const channelMeta: Record<
  Channel,
  { label: string; short: string; tint: string; dot: string; brand: IntegrationBrand }
> = {
  instagram: {
    label: "Instagram",
    short: "IG",
    tint: "bg-muted text-foreground/75",
    dot: "bg-machine",
    brand: "instagram",
  },
  facebook: {
    label: "Messenger",
    short: "FB",
    tint: "bg-muted text-foreground/75",
    dot: "bg-route",
    brand: "messenger",
  },
  whatsapp: {
    label: "WhatsApp",
    short: "WA",
    tint: "bg-muted text-foreground/75",
    dot: "bg-live",
    brand: "whatsapp",
  },
  web: {
    label: "Web chat",
    short: "WEB",
    tint: "bg-muted text-foreground/75",
    dot: "bg-muted-foreground",
    brand: "web",
  },
};

/**
 * BCP-47 tag for a message. Romanised Bangla is Latin script, so it is `bn-Latn`.
 * Tagging it plain `bn` would tell a screen reader to read Roman letters as Bengali.
 */
export const langTag = (language?: Language) =>
  language === "english" ? "en" : language === "bangla" ? "bn" : "bn-Latn";

export const languageMeta: Record<Language, { label: string; short: string }> = {
  banglish: { label: "Banglish", short: "BN-EN" },
  bangla: { label: "Bangla", short: "BN" },
  english: { label: "English", short: "EN" },
};

/* --------------------------------- Agents -------------------------------- */

export const toneOptions = [
  { id: "warm", label: "Warm and personal", hint: "Calls people apu or bhai, allows emoji." },
  { id: "professional", label: "Professional", hint: "Courteous and plain. No emoji." },
  { id: "brief", label: "Brief", hint: "Shortest correct answer. Good for order status." },
  { id: "firm", label: "Firm but kind", hint: "For refusals and policy limits." },
] as const;

export const languagePolicies = [
  { id: "mirror", label: "Mirror the customer", hint: "Reply in whatever they wrote: Banglish, Bangla or English." },
  { id: "bangla", label: "Always Bangla", hint: "Reply in Bengali script regardless of input." },
  { id: "english", label: "Always English", hint: "Reply in English regardless of input." },
] as const;

/* --------------------------------- Agents -------------------------------- */

export interface AgentDef {
  id: AgentRole;
  name: string;
  title: string;
  focus: string;
  escalation: string;
  status: "online" | "busy" | "idle";
  tools: string[];
  handlesNow: number;
  kpis: { resolved: number; containment: number; avgResponse: string; handoffs: number };
  initials: string;
  /* Configuration, editable in the workspace. */
  tone: string;
  languagePolicy: string;
  systemPrompt: string;
}

export const agents: AgentDef[] = [
  {
    id: "router",
    name: "Router",
    title: "Intent & language classifier",
    focus:
      "Reads every inbound message, scores intent, language and sentiment, then assigns the specialist.",
    escalation: "Unknown intent, or classification confidence under 0.60.",
    status: "online",
    tools: ["classify_intent", "detect_language", "score_sentiment"],
    handlesNow: 0,
    kpis: { resolved: 4821, containment: 100, avgResponse: "0.2s", handoffs: 214 },
    initials: "RT",
    tone: "brief",
    languagePolicy: "mirror",
    systemPrompt: `You classify inbound messages. You never reply to a customer yourself.

For every message return four things: intent, language, sentiment, and a confidence score for each.

Bangla written in Roman letters is Banglish. Classify it directly. Do not translate it to English first, because translation flattens exactly the cues sentiment depends on.

Banglish spelling is not standardised. "ache", "ase" and "asey" are the same word, and one person will use two of them in the same thread. Treat them as equivalent.

If your confidence in the intent is below 0.60, route to a person instead of guessing. A slow answer costs less than a wrong one.`,
  },
  {
    id: "sales",
    name: "Sales",
    title: "Discovery & checkout",
    focus:
      "Answers product, sizing and stock questions, then moves the thread to a checkout link.",
    escalation: "Discount requested above the 10% ceiling.",
    status: "busy",
    tools: ["search_products", "check_inventory", "create_payment_link", "apply_discount"],
    handlesNow: 12,
    kpis: { resolved: 1894, containment: 88.2, avgResponse: "1.4s", handoffs: 96 },
    initials: "SA",
    tone: "warm",
    languagePolicy: "mirror",
    systemPrompt: `You sell for Athelier. The person you are talking to found us through a comment or a DM, not a shop.

Quote only stock and prices that came back from a real check. Never state availability from memory. A wrong "yes, we have it" costs the order and the trust.

Answer the question they asked, then offer one next step. One question at a time; this is a conversation, not a form.

You may apply a discount up to 10%. Above that you cannot. Say so plainly and pass it to the Manager rather than hinting it might be possible.

Write back in whatever they wrote in. If they write Banglish, write Banglish.`,
  },
  {
    id: "support",
    name: "Support",
    title: "Order care",
    focus:
      "Tracks orders against live courier data and answers policy questions from the knowledge base.",
    escalation: "Parcel missing, or a policy exception is requested.",
    status: "online",
    tools: ["get_order_status", "search_knowledge_base", "check_return_eligibility"],
    handlesNow: 9,
    kpis: { resolved: 2231, containment: 84.6, avgResponse: "1.1s", handoffs: 143 },
    initials: "SU",
    tone: "professional",
    languagePolicy: "mirror",
    systemPrompt: `You look after orders that already exist.

Status and tracking always come from a live lookup. Never answer "it should arrive tomorrow" from memory or inference. Read it, then say it.

Policy answers come from the knowledge base and must be cited. If the knowledge base does not cover something, say you will check rather than inventing a policy that sounds reasonable.

You cannot issue refunds. When one is clearly warranted, say plainly that you are passing it for approval and roughly how long that takes. Do not imply it is already approved.`,
  },
  {
    id: "retention",
    name: "Retention",
    title: "Recovery & re-engagement",
    focus:
      "Recovers abandoned carts and sends restock alerts, strictly inside the messaging window.",
    escalation: "Opt-out requested, or the messaging window has closed.",
    status: "idle",
    tools: ["recover_cart", "send_restock_alert", "create_offer"],
    handlesNow: 3,
    kpis: { resolved: 642, containment: 79.1, avgResponse: "2.0s", handoffs: 38 },
    initials: "RE",
    tone: "warm",
    languagePolicy: "mirror",
    systemPrompt: `You re-engage people who left something behind.

Before you compose anything, confirm the messaging window is open. If it is closed there is nothing to write. Stop there rather than drafting a message that cannot be sent.

Send one. Do not chase. If they do not reply, that is an answer.

If anyone asks to stop hearing from us, stop immediately and confirm that you have. Never negotiate an opt-out.`,
  },
  {
    id: "operations",
    name: "Operations",
    title: "Catalogue & stock",
    focus: "Keeps the catalogue accurate, counts stock down as orders go out, and flags what is running low.",
    escalation: "Stock looks wrong, or a courier stops responding.",
    status: "online",
    tools: ["sync_inventory", "update_crm_contact", "check_logistics"],
    handlesNow: 0,
    kpis: { resolved: 960, containment: 96.4, avgResponse: "0.9s", handoffs: 11 },
    initials: "OP",
    tone: "brief",
    languagePolicy: "english",
    systemPrompt: `You keep the catalogue honest. You do not talk to customers.

Count stock down as orders go out and put it back when one is returned. Flag anything running low early, while there is still time to restock.

Never invent a product detail. If a size, colour or material was not entered by the shop owner, say it is unknown and ask her rather than filling the gap. She is the one answering for it if a customer is told something wrong.`,
  },
  {
    id: "manager",
    name: "Manager",
    title: "Approvals & escalation",
    focus:
      "Reviews anything a specialist is not permitted to do alone, then approves it or passes it to a person.",
    escalation: "Refund over ৳3,000, or the customer asks for a human.",
    status: "online",
    tools: ["approve_discount", "issue_refund", "approve_exception", "handoff_to_human"],
    handlesNow: 2,
    kpis: { resolved: 214, containment: 61.3, avgResponse: "3.4s", handoffs: 214 },
    initials: "MG",
    tone: "firm",
    languagePolicy: "mirror",
    systemPrompt: `You decide the things a specialist is not permitted to decide alone.

Approve only what merchant policy allows. Platform rules like messaging windows, template categories and consent are never yours to waive, and you should say so plainly when someone asks you to.

When you hand a thread to a person, attach the transcript, the sentiment score, the order, and one sentence on what you would do. They should not have to reconstruct anything.

If a customer asks for a human, pass it on immediately. Do not try one more answer first.`,
  },
];

export const agentById = (id: AgentRole) => agents.find((a) => a.id === id)!;

export const humanTeam = [
  { id: "h1", name: "Ayesha Karim", role: "Customer lead", initials: "AK", online: true },
  { id: "h2", name: "Tanvir Hossain", role: "Operations", initials: "TH", online: true },
  { id: "h3", name: "Rumana Akter", role: "Helps at weekends", initials: "RA", online: false },
];

/* -------------------------------- Products ------------------------------- */

/**
 * The catalogue lives here, not in a storefront. The sellers this is built for
 * run a Facebook page and nothing else, so there is no Shopify or WooCommerce
 * behind it to be the source of truth. Every field was either typed by the
 * seller or confirmed by her, never guessed from a photo.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt: number | null;
  stock: number;
  sizes: string[];
  colours: string[];
  material: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "restocking";
  sold: number;
  /** How it got into the catalogue. */
  addedVia: "photo" | "reply" | "manual";
  addedOn: string;
}

export const products: Product[] = [
  { id: "P-1042", name: "Chaya Cotton Kurti", category: "Kurti", price: 1290, compareAt: 1650, stock: 42, sizes: ["S", "M", "L", "XL"], colours: ["Dusty rose", "Sage", "Ivory"], material: "Cotton", status: "in-stock", sold: 320, addedVia: "photo", addedOn: "02 Aug" },
  { id: "P-1098", name: "Nandini Embroidered Kurti", category: "Kurti", price: 1590, compareAt: null, stock: 8, sizes: ["M", "L", "XL"], colours: ["Sage"], material: "Cotton with embroidery", status: "low-stock", sold: 141, addedVia: "photo", addedOn: "04 Aug" },
  { id: "P-1155", name: "Milan Anarkali Gown", category: "Gown", price: 2450, compareAt: 2900, stock: 0, sizes: ["M"], colours: ["Ivory"], material: "Georgette", status: "out-of-stock", sold: 87, addedVia: "manual", addedOn: "28 Jul" },
  { id: "P-1207", name: "Dhakai Jamdani Saree", category: "Saree", price: 3890, compareAt: 4500, stock: 14, sizes: ["Free size"], colours: ["Cream"], material: "Handloom cotton", status: "in-stock", sold: 203, addedVia: "photo", addedOn: "29 Jul" },
  { id: "P-1212", name: "Tangail Cotton Saree", category: "Saree", price: 2190, compareAt: null, stock: 3, sizes: ["Free size"], colours: ["Mustard"], material: "Cotton", status: "low-stock", sold: 119, addedVia: "reply", addedOn: "06 Aug" },
  { id: "P-1330", name: "Leather Block-Heel Sandal", category: "Footwear", price: 1980, compareAt: 2400, stock: 26, sizes: ["36", "37", "38", "39", "40", "41"], colours: ["Tan"], material: "Leather", status: "in-stock", sold: 174, addedVia: "photo", addedOn: "31 Jul" },
  { id: "P-1388", name: "Terracotta Earrings", category: "Accessories", price: 490, compareAt: null, stock: 61, sizes: ["One size"], colours: ["Rust"], material: "Terracotta", status: "in-stock", sold: 402, addedVia: "manual", addedOn: "24 Jul" },
  { id: "P-1410", name: "Silk Dupatta", category: "Accessories", price: 890, compareAt: 1200, stock: 0, sizes: ["Free size"], colours: ["Emerald"], material: "Silk", status: "restocking", sold: 95, addedVia: "reply", addedOn: "01 Aug" },
];

export const addedViaMeta: Record<Product["addedVia"], string> = {
  photo: "From a photo",
  reply: "From your reply",
  manual: "Typed in",
};

/**
 * Adding a product: the seller types the way she thinks, and the model pulls
 * structure out of it. It extracts what she said. It never invents an attribute
 * she did not state, because she is the one liable for the claim.
 */
export const catalogueDraft = {
  typed: "nokshi kurti 1450 M L XL cotton 2 colour maroon r navy",
  extracted: [
    { field: "Name", value: "Nokshi Kurti", note: "from what you typed" },
    { field: "Price", value: "৳1,450", note: "from what you typed" },
    { field: "Sizes", value: "M, L, XL", note: "from what you typed" },
    { field: "Material", value: "Cotton", note: "from what you typed" },
    { field: "Colours", value: "Maroon, Navy", note: "“r” read as “and”" },
    { field: "Category", value: "Kurti", note: "matched to your other kurtis" },
  ],
  asks: [
    { question: "How many do you have?", why: "Needed before it can quote stock to anyone." },
    { question: "Is the price the same in every size?", why: "Sellers often charge more for XL." },
  ],
};

export const productById = (id: string) => products.find((p) => p.id === id);

/* --------------------------------- Orders -------------------------------- */

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "return-requested"
  | "returned";

export type PaymentMethod = "bKash" | "Nagad" | "Cash on delivery";
/**
 * Cash on delivery is most of the volume here, and the courier holds the cash
 * for days before remitting it. Calling a delivered COD order "paid" tells her
 * she has money she cannot spend yet, which is the wrong answer to the question
 * she actually asks: kobe taka pabo.
 */
export type PaymentState =
  /** In her hand. Prepaid and confirmed, or a courier payout that has landed. */
  | "settled"
  /** The courier collected the cash and still owes it to her. */
  | "collected"
  /** Not paid yet. */
  | "pending"
  /** Cash on delivery, not yet delivered. */
  | "on-delivery"
  | "refunded"
  /** Refused at the door, so nothing was ever collected. */
  | "uncollected";

export interface OrderEvent {
  label: string;
  at: string;
  done: boolean;
  by?: "agent" | "human" | "courier" | "system";
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  /** Written the way the customer sent it, because that is what the rider reads. */
  address: string;
  area: string;
  /** True once she has rung to confirm. Unconfirmed COD is how parcels come back. */
  confirmedByCall: boolean;
  sku: string;
  product: string;
  qty: number;
  amount: number;
  channel: Channel;
  agent: AgentRole;
  status: OrderStatus;
  placed: string;
  eta: string;
  tracking: string;
  courier: string;
  zone: "Dhaka Metro" | "Outside Dhaka";
  payment: PaymentMethod;
  paymentState: PaymentState;
  conversationId?: string;
  timeline: OrderEvent[];
}

export const orders: Order[] = [
  {
    id: "ORD-9317", address: "House 42, Road 8, Block C, Bashundhara R/A, Dhaka-1229", area: "Bashundhara", confirmedByCall: true, customer: "Rafiul Islam", phone: "01711-224500", sku: "P-1042",
    product: "Chaya Cotton Kurti", qty: 2, amount: 2580, channel: "whatsapp", agent: "sales",
    status: "shipped", placed: "09 Aug", eta: "14 Aug", tracking: "BD00182917", courier: "Pathao",
    zone: "Dhaka Metro", payment: "bKash", paymentState: "settled", conversationId: "CV-220",
    timeline: [
      { label: "Order placed from DM", at: "09 Aug · 14:22", done: true, by: "agent" },
      { label: "bKash received, screenshot checked", at: "09 Aug · 14:26", done: true, by: "system" },
      { label: "Picked and packed", at: "10 Aug · 09:10", done: true, by: "human" },
      { label: "Handed to Pathao", at: "10 Aug · 16:40", done: true, by: "courier" },
      { label: "Out for delivery", at: "Expected 14 Aug", done: false, by: "courier" },
    ],
  },
  {
    id: "ORD-9316", address: "Flat 5B, House 11, Road 4, Dhanmondi, Dhaka-1209", area: "Dhanmondi", confirmedByCall: true, customer: "Tasnim Rahman", phone: "01818-993210", sku: "P-1207",
    product: "Dhakai Jamdani Saree", qty: 1, amount: 3890, channel: "instagram", agent: "sales",
    status: "processing", placed: "10 Aug", eta: "15 Aug", tracking: "BD00182909", courier: "Pathao",
    zone: "Dhaka Metro", payment: "Nagad", paymentState: "settled", conversationId: "CV-221",
    timeline: [
      { label: "Order placed from DM", at: "10 Aug · 11:05", done: true, by: "agent" },
      { label: "Nagad received, screenshot checked", at: "10 Aug · 11:09", done: true, by: "system" },
      { label: "Picked and packed", at: "Expected 12 Aug", done: false, by: "human" },
      { label: "Handed to courier", at: "Expected 12 Aug", done: false, by: "courier" },
    ],
  },
  {
    id: "ORD-9315", address: "Ward 5, Boalia, Rajshahi-6000", area: "Rajshahi", confirmedByCall: true, customer: "Nusrat Jahan", phone: "01677-120984", sku: "P-1212",
    product: "Tangail Cotton Saree", qty: 1, amount: 2190, channel: "whatsapp", agent: "support",
    status: "delivered", placed: "05 Aug", eta: "11 Aug", tracking: "BD00182902", courier: "Steadfast",
    zone: "Outside Dhaka", payment: "Cash on delivery", paymentState: "collected",
    timeline: [
      { label: "Order placed from DM", at: "05 Aug · 19:40", done: true, by: "agent" },
      { label: "Confirmation call · answered", at: "05 Aug · 20:15", done: true, by: "human" },
      { label: "Picked and packed", at: "06 Aug · 10:15", done: true, by: "human" },
      { label: "Handed to Steadfast", at: "06 Aug · 17:20", done: true, by: "courier" },
      { label: "Delivered · cash collected", at: "11 Aug · 13:02", done: true, by: "courier" },
    ],
  },
  {
    id: "ORD-9308", address: "Village: Baraigram, Post: Banpara, Natore", area: "Natore", confirmedByCall: false, customer: "Md. Sabbir Ahmed", phone: "01512-345673", sku: "P-1330",
    product: "Leather Block-Heel Sandal", qty: 1, amount: 1980, channel: "facebook", agent: "retention",
    status: "returned", placed: "02 Aug", eta: "n/a", tracking: "BD00182849", courier: "RedX",
    zone: "Outside Dhaka", payment: "Cash on delivery", paymentState: "uncollected",
    timeline: [
      { label: "Order placed from DM", at: "02 Aug · 22:48", done: true, by: "agent" },
      { label: "Confirmation call · no answer ×2", at: "03 Aug · 11:30", done: true, by: "human" },
      { label: "Shipped anyway", at: "03 Aug · 16:05", done: true, by: "human" },
      { label: "Refused at the door", at: "06 Aug · 14:20", done: true, by: "courier" },
      { label: "Returned to origin · ৳195 lost", at: "09 Aug · 10:00", done: true, by: "courier" },
    ],
  },
  {
    id: "ORD-9314", address: "House 9, Sector 4, Uttara, Dhaka-1230", area: "Uttara", confirmedByCall: true, customer: "Shakil Ahmed", phone: "01922-845671", sku: "P-1330",
    product: "Leather Block-Heel Sandal", qty: 1, amount: 1980, channel: "whatsapp", agent: "manager",
    status: "return-requested", placed: "06 Aug", eta: "n/a", tracking: "BD00182894", courier: "Pathao",
    zone: "Dhaka Metro", payment: "bKash", paymentState: "settled", conversationId: "CV-218",
    timeline: [
      { label: "Order placed from DM", at: "06 Aug · 12:30", done: true, by: "agent" },
      { label: "bKash received, screenshot checked", at: "06 Aug · 12:31", done: true, by: "human" },
      { label: "Delivered", at: "09 Aug · 15:44", done: true, by: "courier" },
      { label: "Return requested · size", at: "11 Aug · 20:12", done: true, by: "agent" },
      { label: "Refund awaiting approval", at: "Now", done: false, by: "human" },
    ],
  },
  {
    id: "ORD-9313", address: "Holding 108, Ward 12, Kotwali, Chattogram-4000", area: "Chattogram", confirmedByCall: true, customer: "Mehedi Hasan", phone: "01521-447803", sku: "P-1388",
    product: "Terracotta Earrings", qty: 3, amount: 1470, channel: "facebook", agent: "retention",
    status: "shipped", placed: "08 Aug", eta: "13 Aug", tracking: "BD00182881", courier: "Pathao",
    zone: "Dhaka Metro", payment: "bKash", paymentState: "settled",
    timeline: [
      { label: "Cart recovered by Retention", at: "08 Aug · 09:02", done: true, by: "agent" },
      { label: "bKash received, screenshot checked", at: "08 Aug · 09:18", done: true, by: "system" },
      { label: "Handed to Pathao", at: "09 Aug · 15:00", done: true, by: "courier" },
      { label: "Out for delivery", at: "Expected 13 Aug", done: false, by: "courier" },
    ],
  },
  {
    id: "ORD-9312", address: "Mirpur 10 golchottor er pashe, hasan store er upore, Dhaka-1216", area: "Mirpur", confirmedByCall: false, customer: "Sadia Chowdhury", phone: "01733-880214", sku: "P-1410",
    product: "Silk Dupatta", qty: 1, amount: 890, channel: "instagram", agent: "sales",
    status: "confirmed", placed: "11 Aug", eta: "16 Aug", tracking: "Awaiting pickup", courier: "Pathao",
    zone: "Dhaka Metro", payment: "Cash on delivery", paymentState: "on-delivery", conversationId: "CV-215",
    timeline: [
      { label: "Order placed from DM", at: "11 Aug · 21:14", done: true, by: "agent" },
      { label: "Cash on delivery confirmed", at: "11 Aug · 21:15", done: true, by: "system" },
      { label: "Awaiting restock", at: "Expected 13 Aug", done: false, by: "human" },
    ],
  },
  {
    id: "ORD-9311", address: "Zindabazar, Sylhet-3100", area: "Sylhet", confirmedByCall: true, customer: "Farhan Kabir", phone: "01844-109876", sku: "P-1098",
    product: "Nandini Embroidered Kurti", qty: 2, amount: 3180, channel: "facebook", agent: "sales",
    status: "shipped", placed: "07 Aug", eta: "12 Aug", tracking: "BD00182870", courier: "RedX",
    zone: "Outside Dhaka", payment: "bKash", paymentState: "settled", conversationId: "CV-217",
    timeline: [
      { label: "Order placed from DM", at: "07 Aug · 16:50", done: true, by: "agent" },
      { label: "bKash received, screenshot checked", at: "07 Aug · 16:55", done: true, by: "system" },
      { label: "Handed to RedX", at: "08 Aug · 14:10", done: true, by: "courier" },
      { label: "In transit to Sylhet", at: "Expected 12 Aug", done: false, by: "courier" },
    ],
  },
  {
    id: "ORD-9310", address: "House 22, Road 2, Banani, Dhaka-1213", area: "Banani", confirmedByCall: true, customer: "Priya Dutta", phone: "01611-334455", sku: "P-1155",
    product: "Milan Anarkali Gown", qty: 1, amount: 2450, channel: "whatsapp", agent: "support",
    status: "returned", placed: "30 Jul", eta: "n/a", tracking: "BD00182863", courier: "Pathao",
    zone: "Dhaka Metro", payment: "bKash", paymentState: "refunded", conversationId: "CV-216",
    timeline: [
      { label: "Order placed from DM", at: "30 Jul · 10:20", done: true, by: "agent" },
      { label: "Delivered", at: "03 Aug · 12:40", done: true, by: "courier" },
      { label: "Return collected", at: "07 Aug · 11:30", done: true, by: "courier" },
      { label: "Refund issued · ৳2,450", at: "08 Aug · 09:00", done: true, by: "human" },
    ],
  },
];

export const orderStatusMeta: Record<OrderStatus, { label: string; tone: string }> = {
  confirmed: { label: "Confirmed", tone: "bg-route-soft text-route-ink" },
  processing: { label: "Processing", tone: "bg-pend-soft text-pend-ink" },
  shipped: { label: "Shipped", tone: "bg-route-soft text-route-ink" },
  delivered: { label: "Delivered", tone: "bg-live-soft text-live-ink" },
  "return-requested": { label: "Return requested", tone: "bg-block-soft text-block-ink" },
  returned: { label: "Returned", tone: "bg-muted text-muted-foreground" },
};

export const paymentStateMeta: Record<PaymentState, { label: string; tone: string }> = {
  settled: { label: "In your hand", tone: "bg-live-soft text-live-ink" },
  collected: { label: "Courier has it", tone: "bg-pend-soft text-pend-ink" },
  pending: { label: "Pending", tone: "bg-pend-soft text-pend-ink" },
  "on-delivery": { label: "On delivery", tone: "bg-muted text-muted-foreground" },
  refunded: { label: "Refunded", tone: "bg-block-soft text-block-ink" },
  uncollected: { label: "Not collected", tone: "bg-block-soft text-block-ink" },
};

/* ------------------------------ Conversations ---------------------------- */

export interface ToolInvocation {
  id: string;
  tool: string;
  args: Record<string, string | number>;
  outcome: Outcome;
  detail: string;
  latencyMs: number;
  policy?: string;
}

export interface Citation {
  doc: string;
  snippet: string;
  score: number;
}

export interface Message {
  id: string;
  author: "customer" | "agent" | "human" | "system";
  agent?: AgentRole;
  humanName?: string;
  text: string;
  script?: "bengali";
  gloss?: string;
  time: string;
  language?: Language;
  confidence?: number;
  tools?: ToolInvocation[];
  citations?: Citation[];
  productRef?: string;
}

export type ConversationStatus = "active" | "awaiting-approval" | "with-human" | "resolved";

export interface MessagingWindow {
  kind: "24h" | "csw" | "private-reply" | "closed";
  label: string;
  remaining: string;
  pct: number;
}

export interface Conversation {
  id: string;
  customer: string;
  handle: string;
  initials: string;
  channel: Channel;
  agent: AgentRole;
  intent: string;
  sentiment: Sentiment;
  language: Language;
  languageConfidence: number;
  intentConfidence: number;
  time: string;
  unread: number;
  status: ConversationStatus;
  window: MessagingWindow;
  orderId?: string;
  origin: string;
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: "CV-221",
    customer: "Tasnim Rahman",
    handle: "@tasnim.r",
    initials: "TR",
    channel: "instagram",
    agent: "sales",
    intent: "Product inquiry",
    sentiment: "positive",
    language: "banglish",
    languageConfidence: 0.94,
    intentConfidence: 0.91,
    time: "now",
    unread: 2,
    status: "active",
    window: { kind: "24h", label: "Standard 24h window", remaining: "23h 41m", pct: 98 },
    orderId: "ORD-9316",
    origin: "Comment on “Summer edit” post",
    messages: [
      {
        id: "m1", author: "customer", text: "Dam koto ei saree ta?", time: "14:02",
        language: "banglish", gloss: "What's the price of this saree?",
      },
      {
        id: "m2", author: "agent", agent: "router", text: "Routed to Sales. Product inquiry, Banglish, positive.",
        time: "14:02", confidence: 0.91,
        tools: [
          { id: "t1", tool: "classify_intent", args: { text: "Dam koto ei saree ta?" }, outcome: "allowed", detail: "product-inquiry · 0.91", latencyMs: 180 },
          { id: "t2", tool: "detect_language", args: { text: "Dam koto ei saree ta?" }, outcome: "allowed", detail: "banglish · 0.94", latencyMs: 60 },
        ],
      },
      {
        id: "m3", author: "agent", agent: "sales",
        text: "Dhakai Jamdani Saree ta ৳3,890. Regular ৳4,500 theke kome. Cream colour ta ekhono ache, 14 ta stock e. Apnar jonno ekta rekhe dibo?",
        gloss: "The Dhakai Jamdani Saree is ৳3,890, down from ৳4,500. The cream colour is still available, 14 in stock. Shall I hold one for you?",
        time: "14:02", language: "banglish", confidence: 0.93, productRef: "P-1207",
        tools: [
          { id: "t3", tool: "search_products", args: { query: "jamdani saree" }, outcome: "allowed", detail: "1 match · Dhakai Jamdani Saree", latencyMs: 240 },
          { id: "t4", tool: "check_inventory", args: { sku: "P-1207" }, outcome: "allowed", detail: "14 left", latencyMs: 310 },
        ],
      },
      {
        id: "m4", author: "customer", text: "Ha rakhen. Delivery Dhaka te koto din?", time: "14:05",
        language: "banglish", gloss: "Yes hold it. How many days for delivery in Dhaka?",
      },
      {
        id: "m5", author: "agent", agent: "sales",
        text: "Dhaka Metro te 2–3 din. Ei nin apnar checkout link. COD o nite paren.",
        gloss: "2–3 days in Dhaka Metro. Here's your checkout link. You can also pay cash on delivery.",
        time: "14:05", language: "banglish", confidence: 0.96,
        citations: [
          { doc: "Shipping & Delivery Guide", snippet: "Dhaka Metro: 2–3 working days. Outside Dhaka: 3–5 working days.", score: 0.93 },
        ],
        tools: [
          { id: "t5", tool: "search_knowledge_base", args: { query: "delivery time dhaka" }, outcome: "allowed", detail: "2 chunks · top score 0.93", latencyMs: 210 },
          { id: "t6", tool: "create_payment_link", args: { sku: "P-1207", qty: 1 }, outcome: "allowed", detail: "Draft order created · link issued", latencyMs: 640 },
        ],
      },
    ],
  },
  {
    id: "CV-220",
    customer: "Rafiul Islam",
    handle: "01711…4500",
    initials: "RI",
    channel: "whatsapp",
    agent: "support",
    intent: "Order tracking",
    sentiment: "neutral",
    language: "bangla",
    languageConfidence: 0.97,
    intentConfidence: 0.93,
    time: "4m",
    unread: 1,
    status: "active",
    window: { kind: "csw", label: "WhatsApp service window", remaining: "23h 55m", pct: 99 },
    orderId: "ORD-9317",
    origin: "Direct WhatsApp message",
    messages: [
      {
        id: "m1", author: "customer", text: "আমার অর্ডারটা কোথায়?", script: "bengali",
        gloss: "Where is my order?", time: "10:38", language: "bangla",
      },
      {
        id: "m2", author: "agent", agent: "support",
        text: "আপনার অর্ডার ORD-9317 পাঠাও তে আছে। ট্র্যাকিং BD00182917। ১৪ আগস্টের মধ্যে পৌঁছে যাবে।",
        script: "bengali",
        gloss: "Your order ORD-9317 is with Pathao, tracking BD00182917. It will arrive by 14 August.",
        time: "10:38", language: "bangla", confidence: 0.94,
        tools: [
          { id: "t1", tool: "get_order_status", args: { phone: "01711-224500" }, outcome: "allowed", detail: "ORD-9317 · shipped · Pathao BD00182917", latencyMs: 380 },
          { id: "t2", tool: "check_logistics", args: { tracking: "BD00182917" }, outcome: "allowed", detail: "In transit · Tejgaon hub", latencyMs: 520 },
        ],
      },
      { id: "m3", author: "customer", text: "ধন্যবাদ", script: "bengali", gloss: "Thank you", time: "10:41", language: "bangla" },
    ],
  },
  {
    id: "CV-219",
    customer: "Nusrat Jahan",
    handle: "@nusrat.j",
    initials: "NJ",
    channel: "instagram",
    agent: "retention",
    intent: "Abandoned cart",
    sentiment: "positive",
    language: "english",
    languageConfidence: 0.99,
    intentConfidence: 0.87,
    time: "18m",
    unread: 0,
    status: "active",
    window: { kind: "24h", label: "Standard 24h window", remaining: "6h 04m", pct: 25 },
    origin: "Story reply",
    messages: [
      {
        id: "m1", author: "customer", text: "I left something in my cart yesterday, is it still there?",
        time: "09:50", language: "english",
      },
      {
        id: "m2", author: "agent", agent: "retention",
        text: "It is. The Tangail Cotton Saree in mustard, ৳2,190. Only 3 left, so I've held one for you for the next 6 hours.",
        time: "09:51", language: "english", confidence: 0.92, productRef: "P-1212",
        tools: [
          { id: "t1", tool: "recover_cart", args: { customer: "@nusrat.j" }, outcome: "allowed", detail: "1 item · window open 6h 04m", latencyMs: 260 },
          { id: "t2", tool: "check_inventory", args: { sku: "P-1212" }, outcome: "allowed", detail: "3 units · low stock", latencyMs: 300 },
          { id: "t3", tool: "apply_discount", args: { percent: 15, reason: "cart recovery" }, outcome: "blocked", detail: "15% exceeds the 10% ceiling · not sent", latencyMs: 8, policy: "P-01" },
        ],
      },
    ],
  },
  {
    id: "CV-218",
    customer: "Shakil Ahmed",
    handle: "01922…5671",
    initials: "SA",
    channel: "whatsapp",
    agent: "manager",
    intent: "Refund request",
    sentiment: "negative",
    language: "banglish",
    languageConfidence: 0.88,
    intentConfidence: 0.95,
    time: "32m",
    unread: 3,
    status: "awaiting-approval",
    window: { kind: "csw", label: "WhatsApp service window", remaining: "20h 12m", pct: 84 },
    orderId: "ORD-9314",
    origin: "Direct WhatsApp message",
    messages: [
      {
        id: "m1", author: "customer",
        text: "Vai sandal ta size e hoy nai. Amar taka ferot chai, ekhon e.",
        gloss: "Brother, the sandal doesn't fit. I want my money back, right now.",
        time: "20:12", language: "banglish",
      },
      {
        id: "m2", author: "agent", agent: "router",
        text: "Routed to Support. Refund request, negative sentiment 0.86.",
        time: "20:12", confidence: 0.95,
        tools: [
          { id: "t1", tool: "score_sentiment", args: { text: "Amar taka ferot chai, ekhon e" }, outcome: "allowed", detail: "negative · 0.86", latencyMs: 140 },
        ],
      },
      {
        id: "m3", author: "agent", agent: "support",
        text: "Dukkhito Shakil bhai. ORD-9314 ta ami dekhchi. 9 August e deliver hoyeche, tai 7 diner return window er bhitorei achen. Return ta ami process kore dicchi.",
        gloss: "Sorry Shakil bhai. I'm looking at ORD-9314. Delivered on 9 August, so you're inside the 7-day return window. I'm processing the return.",
        time: "20:13", language: "banglish", confidence: 0.9,
        citations: [
          { doc: "Return & Refund Policy 2026", snippet: "Returns accepted within 7 days of delivery when the item is unworn and tagged.", score: 0.96 },
        ],
        tools: [
          { id: "t2", tool: "get_order_status", args: { order_id: "ORD-9314" }, outcome: "allowed", detail: "delivered 09 Aug · BD00182894", latencyMs: 420 },
          { id: "t3", tool: "check_return_eligibility", args: { order_id: "ORD-9314" }, outcome: "allowed", detail: "eligible · 2 days remaining", latencyMs: 190 },
        ],
      },
      {
        id: "m4", author: "agent", agent: "support",
        text: "Refund of ৳1,980 proposed.",
        time: "20:13",
        tools: [
          { id: "t4", tool: "issue_refund", args: { order_id: "ORD-9314", amount: 1980 }, outcome: "blocked", detail: "Support cannot refund. Sent to the Manager.", latencyMs: 12, policy: "P-02" },
        ],
      },
      {
        id: "m5", author: "system",
        text: "Manager review requested. Refund ৳1,980 on ORD-9314. Under the ৳3,000 ceiling, but outside what Support is allowed to do.",
        time: "20:14",
      },
    ],
  },
  {
    id: "CV-217",
    customer: "Farhan Kabir",
    handle: "@farhan.k",
    initials: "FK",
    channel: "facebook",
    agent: "sales",
    intent: "Restock question",
    sentiment: "positive",
    language: "banglish",
    languageConfidence: 0.9,
    intentConfidence: 0.89,
    time: "1h",
    unread: 0,
    status: "resolved",
    window: { kind: "24h", label: "Standard 24h window", remaining: "22h 50m", pct: 95 },
    orderId: "ORD-9311",
    origin: "Comment on “Summer edit” post",
    messages: [
      // Note the spelling: this customer writes "ase", the one in CV-221 writes "ache".
      // Banglish has no standard orthography and the same word varies within a thread.
      // Normalising that variance is precisely what the classifier is for, so the demo
      // data must contain it rather than read as tidily invented.
      { id: "m1", author: "customer", text: "Kemon dam? Ar M size ase?", gloss: "What's the price? And is M size available?", time: "09:12", language: "banglish" },
      {
        id: "m2", author: "agent", agent: "sales",
        text: "Nandini Embroidered Kurti ৳1,590. M size ache, 8 ta baki. Checkout link pathacchi.",
        gloss: "The Nandini Embroidered Kurti is ৳1,590. M is available, 8 left. Sending the checkout link.",
        time: "09:12", language: "banglish", confidence: 0.95, productRef: "P-1098",
        tools: [
          { id: "t1", tool: "check_inventory", args: { sku: "P-1098" }, outcome: "allowed", detail: "8 units · low stock", latencyMs: 290 },
          { id: "t2", tool: "create_payment_link", args: { sku: "P-1098", qty: 2 }, outcome: "allowed", detail: "Draft order created · ORD-9311", latencyMs: 610 },
        ],
      },
    ],
  },
  {
    id: "CV-216",
    customer: "Priya Dutta",
    handle: "01611…3455",
    initials: "PD",
    channel: "whatsapp",
    agent: "manager",
    intent: "Return",
    sentiment: "negative",
    language: "bangla",
    languageConfidence: 0.95,
    intentConfidence: 0.92,
    time: "2h",
    unread: 0,
    status: "with-human",
    window: { kind: "csw", label: "WhatsApp service window", remaining: "18h 30m", pct: 77 },
    orderId: "ORD-9310",
    origin: "Direct WhatsApp message",
    messages: [
      { id: "m1", author: "customer", text: "গাউনটা ফেরত দিতে চাই", script: "bengali", gloss: "I want to return the gown", time: "08:20", language: "bangla" },
      {
        id: "m2", author: "agent", agent: "manager",
        text: "Refund ৳2,450 proposed on ORD-9310.",
        time: "08:21",
        tools: [
          { id: "t1", tool: "issue_refund", args: { order_id: "ORD-9310", amount: 2450 }, outcome: "approved", detail: "Approved by Ayesha Karim · under ৳3,000 ceiling", latencyMs: 940, policy: "P-02" },
        ],
      },
      {
        id: "m3", author: "human", humanName: "Ayesha Karim",
        text: "Priya apu, return ta approve kore diyechi. Courier kal shokale collect korbe, refund 5–7 working day e account e chole jabe.",
        gloss: "Priya, I've approved the return. The courier will collect tomorrow morning, and the refund will reach your account in 5–7 working days.",
        time: "08:24", language: "banglish",
      },
    ],
  },
  {
    id: "CV-215",
    customer: "Sadia Chowdhury",
    handle: "@sadia.c",
    initials: "SC",
    channel: "instagram",
    agent: "sales",
    intent: "Sizing",
    sentiment: "positive",
    language: "banglish",
    languageConfidence: 0.86,
    intentConfidence: 0.9,
    time: "3h",
    unread: 1,
    status: "resolved",
    window: { kind: "24h", label: "Standard 24h window", remaining: "20h 15m", pct: 84 },
    orderId: "ORD-9312",
    origin: "Comment on “Summer edit” post",
    messages: [
      { id: "m1", author: "customer", text: "Amar height 5'4\", kon size nibo?", gloss: "I'm 5'4\", which size should I take?", time: "07:30", language: "banglish" },
      {
        id: "m2", author: "agent", agent: "sales",
        text: "5'4\" er jonno M size ta perfect hobe. Waist 30–32\", chest 36–38\". Sizing guide theke bolchi.",
        gloss: "For 5'4\" the M size will be perfect. Waist 30–32\", chest 36–38\". This is from the sizing guide.",
        time: "07:31", language: "banglish", confidence: 0.88,
        citations: [
          { doc: "Sizing Guide: Kurti & Saree", snippet: "Size M fits a 30–32\" waist and 36–38\" chest.", score: 0.91 },
        ],
        tools: [
          { id: "t1", tool: "search_knowledge_base", args: { query: "size M measurements kurti" }, outcome: "allowed", detail: "4 chunks · top score 0.91", latencyMs: 230 },
        ],
      },
    ],
  },
];

export const conversationById = (id: string) => conversations.find((c) => c.id === id);

export const sentimentMeta: Record<Sentiment, { label: string; tone: string; dot: string }> = {
  positive: { label: "Positive", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  neutral: { label: "Neutral", tone: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  negative: { label: "Negative", tone: "bg-block-soft text-block-ink", dot: "bg-block" },
};

export const conversationStatusMeta: Record<
  ConversationStatus,
  { label: string; tone: string }
> = {
  active: { label: "Agent handling", tone: "bg-route-soft text-route-ink" },
  "awaiting-approval": { label: "Awaiting approval", tone: "bg-pend-soft text-pend-ink" },
  "with-human": { label: "With a person", tone: "bg-machine-soft text-machine-ink" },
  resolved: { label: "Resolved", tone: "bg-live-soft text-live-ink" },
};

/* ----------------------------- Comment to DM ----------------------------- */

export const demoPost = {
  caption: "Summer edit is here. The Chaya Cotton Kurti, now in three new colours.",
  posted: "2 hours ago",
  likes: 1248,
  commentCount: 86,
  reach: 24310,
  triggerKeywords: ["price", "dam", "koto", "size", "delivery"],
};

export interface PostComment {
  id: string;
  name: string;
  handle: string;
  initials: string;
  text: string;
  script?: "bengali";
  gloss?: string;
  time: string;
  detection: {
    trigger: "keyword" | "semantic" | "none";
    matched?: string;
    intent?: string;
    confidence: number;
    language: Language;
  };
  state: "queued" | "replied" | "skipped";
  reply?: string;
  skipReason?: string;
}

export const postComments: PostComment[] = [
  {
    id: "cm1", name: "Tasnim Rahman", handle: "@tasnim.r", initials: "TR", text: "PRICE", time: "2m",
    detection: { trigger: "keyword", matched: "price", intent: "price-inquiry", confidence: 1, language: "english" },
    state: "replied",
    reply: "Tasnim apu, the Chaya Cotton Kurti is ৳1,290 (was ৳1,650). Which colour were you looking at?",
  },
  {
    id: "cm2", name: "Farhan Kabir", handle: "@farhan.k", initials: "FK", text: "Kemon dam? 👀",
    gloss: "What's the price?", time: "9m",
    detection: { trigger: "keyword", matched: "dam", intent: "price-inquiry", confidence: 0.97, language: "banglish" },
    state: "replied",
    reply: "Farhan bhai, Chaya Cotton Kurti ৳1,290. Regular ৳1,650 theke kome. Kon colour ta pochondo?",
  },
  {
    id: "cm3", name: "Priya Dutta", handle: "@priya.d", initials: "PD", text: "Siz available M?",
    time: "14m",
    detection: { trigger: "semantic", intent: "sizing", confidence: 0.84, language: "banglish" },
    state: "replied",
    reply: "Priya apu, M is in stock. It fits a 30–32\" waist. Want me to hold one?",
  },
  {
    id: "cm4", name: "Mehedi Hasan", handle: "@mehedi.h", initials: "MH", text: "Wow, so beautiful 😍", time: "22m",
    detection: { trigger: "none", confidence: 0.12, language: "english" },
    state: "skipped",
    skipReason: "No commercial intent, praise only. No DM sent.",
  },
  {
    id: "cm5", name: "Sadia Chowdhury", handle: "@sadia.c", initials: "SC", text: "Dhaka te delivery hoy? 🚚",
    gloss: "Do you deliver in Dhaka?", time: "41m",
    detection: { trigger: "keyword", matched: "delivery", intent: "delivery", confidence: 0.95, language: "banglish" },
    state: "replied",
    reply: "Sadia apu, Dhaka Metro te 2–3 din, ar COD o ache. Order korte chaile link pathiye dicchi.",
  },
  {
    id: "cm6", name: "Nusrat Jahan", handle: "@nusrat.j", initials: "NJ", text: "Eta ki khati cotton?",
    gloss: "Is this pure cotton?", time: "1h",
    detection: { trigger: "semantic", intent: "material", confidence: 0.79, language: "banglish" },
    state: "replied",
    reply: "Nusrat apu, ha. 100% cotton, handloom bona. Care guide o pathate pari cheile.",
  },
  {
    id: "cm7", name: "Shakil Ahmed", handle: "@shakil.a", initials: "SA", text: "Nice shot 👌", time: "3h",
    detection: { trigger: "none", confidence: 0.08, language: "english" },
    state: "skipped",
    skipReason: "No commercial intent, praise only. No DM sent.",
  },
  {
    id: "cm8", name: "Imran Chowdhury", handle: "@imran.c", initials: "IC", text: "দাম কত?", script: "bengali",
    gloss: "How much is the price?", time: "3h",
    detection: { trigger: "semantic", intent: "price-inquiry", confidence: 0.93, language: "bangla" },
    state: "replied",
    reply: "Imran bhai, Chaya Cotton Kurti ৳1,290. Kon size ta lagbe?",
  },
];

/** Comments that arrive live while the page is open. */
export const incomingComments: PostComment[] = [
  {
    id: "cm9", name: "Rehana Sultana", handle: "@rehana.s", initials: "RS", text: "Ei kurti ta ki XL te pawa jabe?",
    gloss: "Is this kurti available in XL?", time: "now",
    detection: { trigger: "semantic", intent: "sizing", confidence: 0.88, language: "banglish" },
    state: "queued",
    reply: "Rehana apu, XL ache, 6 ta baki. Rekhe dibo apnar jonno?",
  },
  {
    id: "cm10", name: "Jamil Ahsan", handle: "@jamil.a", initials: "JA", text: "price koto vai", time: "now",
    detection: { trigger: "keyword", matched: "price", intent: "price-inquiry", confidence: 0.99, language: "banglish" },
    state: "queued",
    reply: "Jamil bhai, ৳1,290. Regular ৳1,650 theke kome. Kon colour ta chai?",
  },
  {
    id: "cm11", name: "Lubna Haque", handle: "@lubna.h", initials: "LH", text: "so pretty!! 🔥", time: "now",
    detection: { trigger: "none", confidence: 0.09, language: "english" },
    state: "queued",
    skipReason: "No commercial intent, praise only. No DM sent.",
  },
];

/* ---------------------------- Knowledge base ----------------------------- */

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: "PDF" | "Web" | "Policy" | "FAQ";
  category: string;
  pages: number;
  chunks: number;
  status: "indexed" | "syncing" | "failed";
  updated: string;
  size: string;
  usedThisWeek: number;
  error?: string;
}

export const knowledgeDocs: KnowledgeDoc[] = [
  { id: "KB-01", title: "Return & Refund Policy 2026", type: "Policy", category: "Policies", pages: 4, chunks: 18, status: "indexed", updated: "10 Aug", size: "210 KB", usedThisWeek: 412 },
  { id: "KB-02", title: "Shipping & Delivery Guide", type: "Policy", category: "Policies", pages: 3, chunks: 12, status: "indexed", updated: "08 Aug", size: "164 KB", usedThisWeek: 689 },
  { id: "KB-03", title: "Sizing Guide: Kurti & Saree", type: "FAQ", category: "Catalogue", pages: 6, chunks: 24, status: "indexed", updated: "07 Aug", size: "1.2 MB", usedThisWeek: 934 },
  { id: "KB-04", title: "Care Instructions: Handloom", type: "PDF", category: "Catalogue", pages: 8, chunks: 20, status: "syncing", updated: "now", size: "3.4 MB", usedThisWeek: 87 },
  { id: "KB-05", title: "FAQ: Payments & Cash on Delivery", type: "FAQ", category: "Support", pages: 2, chunks: 9, status: "indexed", updated: "05 Aug", size: "96 KB", usedThisWeek: 356 },
  { id: "KB-06", title: "Brand Voice & Reply Guidelines", type: "Web", category: "Policies", pages: 12, chunks: 41, status: "indexed", updated: "02 Aug", size: "740 KB", usedThisWeek: 1204 },
  { id: "KB-07", title: "Product Terms & Fabric Glossary", type: "PDF", category: "Catalogue", pages: 22, chunks: 64, status: "failed", updated: "29 Jul", size: "5.1 MB", usedThisWeek: 0, error: "Scanned pages have no text layer, so OCR is required before indexing." },
];

/* ------------------------- Setup, for page-only shops --------------------- */

/**
 * Most sellers here run a Facebook page and nothing else. They have no policy
 * PDF to upload, so the knowledge base cannot be the first thing we ask them for.
 * These are the questions their customers actually ask all day, and answering
 * them once gives the agents almost everything they need.
 */
export interface BusinessBasics {
  sells: string;
  hasSizes: boolean;
  dhakaCharge: number;
  dhakaDays: string;
  outsideCharge: number;
  outsideDays: string;
  couriers: string[];
  freeOver: number;
  cod: boolean;
  bkash: boolean;
  nagad: boolean;
  advanceOutside: boolean;
  advanceAmount: number;
  acceptReturns: boolean;
  returnDays: number;
  returnPaidBy: "shop" | "customer";
  openFrom: string;
  openTo: string;
  alwaysHuman: string[];
}

export const businessBasicsDefaults: BusinessBasics = {
  sells: "Women's three-piece, saree and kurti",
  hasSizes: true,
  dhakaCharge: 80,
  dhakaDays: "2 to 3 days",
  outsideCharge: 130,
  outsideDays: "3 to 5 days",
  couriers: ["Pathao", "Steadfast"],
  freeOver: 2000,
  cod: true,
  bkash: true,
  nagad: true,
  advanceOutside: true,
  advanceAmount: 200,
  acceptReturns: true,
  returnDays: 7,
  returnPaidBy: "customer",
  openFrom: "10:00",
  openTo: "22:00",
  alwaysHuman: ["Refunds", "Wholesale orders", "Angry customers"],
};

export const courierOptions = ["Pathao", "Steadfast", "RedX", "Paperfly", "Sundarban"];

export const alwaysHumanOptions = [
  "Refunds",
  "Wholesale orders",
  "Angry customers",
  "Custom or made-to-order",
  "Anything over ৳10,000",
];

export interface DerivedAnswer {
  id: string;
  question: string;
  answer: string;
  /** Which step of setup produced it, for the "you answered this" link. */
  from: string;
}

const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

/** Turns the eight answers into the replies an agent can actually send. */
export function derivedAnswers(b: BusinessBasics): DerivedAnswer[] {
  const out: DerivedAnswer[] = [];

  out.push({
    id: "d1",
    question: "How much is delivery?",
    answer: `${taka(b.dhakaCharge)} inside Dhaka and ${taka(b.outsideCharge)} outside${
      b.freeOver > 0 ? `. Free over ${taka(b.freeOver)}` : ""
    }.`,
    from: "Delivery",
  });

  out.push({
    id: "d2",
    question: "How many days will it take?",
    answer: `${b.dhakaDays} inside Dhaka, ${b.outsideDays} outside Dhaka.`,
    from: "Delivery",
  });

  if (b.couriers.length) {
    out.push({
      id: "d3",
      question: "Which courier do you use?",
      answer:
        b.couriers.length === 1
          ? `${b.couriers[0]}.`
          : `${b.couriers.slice(0, -1).join(", ")} and ${b.couriers[b.couriers.length - 1]}.`,
      from: "Delivery",
    });
  }

  out.push({
    id: "d4",
    question: "Do you take cash on delivery?",
    answer: b.cod
      ? b.advanceOutside
        ? `Yes. Inside Dhaka it is full cash on delivery. Outside Dhaka we take ${taka(b.advanceAmount)} in advance and the rest on delivery.`
        : "Yes, cash on delivery everywhere."
      : "No, payment is taken in advance.",
    from: "Payment",
  });

  const wallets = [b.bkash && "bKash", b.nagad && "Nagad"].filter(Boolean) as string[];
  if (wallets.length) {
    out.push({
      id: "d5",
      question: "Can I pay with bKash?",
      answer: `Yes, ${wallets.join(" and ")} both work. Send a screenshot after paying and we will confirm.`,
      from: "Payment",
    });
  }

  out.push({
    id: "d6",
    question: "Can I return it if it does not fit?",
    answer: b.acceptReturns
      ? `Yes, within ${b.returnDays} days, unworn and with the tag on. Return delivery is paid by ${
          b.returnPaidBy === "shop" ? "us" : "the customer"
        }.`
      : "We do not take returns, so please check the measurements before ordering.",
    from: "Returns",
  });

  out.push({
    id: "d7",
    question: "What do you sell?",
    answer: `${b.sells}.`,
    from: "Your shop",
  });

  if (b.hasSizes) {
    out.push({
      id: "d8",
      question: "Do you have my size?",
      answer:
        "Checked live against stock before answering, so the size we quote is the size we have.",
      from: "Your shop",
    });
  }

  out.push({
    id: "d9",
    question: "Are you open now?",
    answer: `A person is around between ${b.openFrom} and ${b.openTo}. Outside those hours the agents still reply, and anything needing a decision waits for morning.`,
    from: "People",
  });

  if (b.alwaysHuman.length) {
    out.push({
      id: "d10",
      question: "I want to speak to a person",
      answer: `Passed straight to you, along with ${b.alwaysHuman
        .map((x) => x.toLowerCase())
        .join(", ")}.`,
      from: "People",
    });
  }

  return out;
}

export interface RetrievalHit {
  id: string;
  doc: string;
  snippet: string;
  vectorScore: number;
  bm25Score: number;
  fusedScore: number;
  rerankScore: number;
  cited: boolean;
}

export const retrievalDemo = {
  query: "COD e ki return kora jabe?",
  gloss: "Can I return something bought with cash on delivery?",
  rewritten: "cash on delivery return eligibility policy",
  language: "banglish" as Language,
  stages: [
    { name: "Understand", detail: "Work out what was actually asked", ms: 40 },
    { name: "Search both ways", detail: "By meaning and by exact words, at once", ms: 155 },
    { name: "Keep the best", detail: "Rank, then drop what does not answer it", ms: 192 },
  ],
  hits: [
    { id: "h1", doc: "Return & Refund Policy 2026", snippet: "Cash-on-delivery orders follow the same 7-day return window. Refunds for COD orders are issued to bKash or Nagad, since no card was charged.", vectorScore: 0.82, bm25Score: 0.91, fusedScore: 0.94, rerankScore: 0.97, cited: true },
    { id: "h2", doc: "FAQ: Payments & Cash on Delivery", snippet: "Cash on delivery is available nationwide at a flat fee of ৳60. Payment is collected by the courier at the door.", vectorScore: 0.88, bm25Score: 0.74, fusedScore: 0.86, rerankScore: 0.81, cited: true },
    { id: "h3", doc: "Shipping & Delivery Guide", snippet: "Dhaka Metro: 2–3 working days. Outside Dhaka: 3–5 working days via Steadfast or RedX.", vectorScore: 0.61, bm25Score: 0.33, fusedScore: 0.52, rerankScore: 0.24, cited: false },
  ] as RetrievalHit[],
  answer:
    "Ha, COD ordereo 7 diner return window prozojjo. Card charge hoy nai tai refund ta bKash ba Nagad e pathano hobe.",
  answerGloss:
    "Yes, COD orders also get the 7-day return window. Since no card was charged, the refund goes to bKash or Nagad.",
};

/* -------------------------------- Guardrails ----------------------------- */

/**
 * A guardrail, written the way a shop owner would say it out loud:
 * "if an agent tries to give a discount of more than 10%, ask me first".
 */
export type GuardrailAction =
  | "discount"
  | "refund"
  | "message"
  | "cancel"
  | "price"
  | "reply";

/**
 * Three genuinely different things can happen:
 *   ask     is hold this one action, you approve it, the agent carries on
 *   handoff is the agent stopping entirely and a person takes over the conversation
 *   block   is it simply not happening, and nobody is interrupted
 */
export type GuardrailOutcome = "ask" | "handoff" | "block";

export const guardrailOutcomes: Record<
  GuardrailOutcome,
  { label: string; tone: string; description: string }
> = {
  ask: {
    label: "ask me first",
    tone: "text-pend-ink",
    description: "Holds that one action until you approve it. The agent keeps the thread.",
  },
  handoff: {
    label: "hand it to a person",
    tone: "text-route-ink",
    description:
      "The agent stops replying and a teammate takes over the whole conversation, with the transcript and order attached.",
  },
  block: {
    label: "don't let it",
    tone: "text-block-ink",
    description: "It does not happen. Nobody is interrupted and the agent carries on without it.",
  },
};

export interface Guardrail {
  id: string;
  action: GuardrailAction;
  /** Written out for display, e.g. "more than 10%". */
  condition: string;
  threshold?: number;
  outcome: GuardrailOutcome;
  enabled: boolean;
  /** Platform rules the merchant cannot switch off. */
  locked?: boolean;
  lockedReason?: string;
  stoppedThisWeek: number;
}

export const guardrailActions: Record<
  GuardrailAction,
  {
    label: string;
    unit: "percent" | "taka" | "choice";
    defaultThreshold?: number;
    conditions?: string[];
  }
> = {
  discount: { label: "give a discount", unit: "percent", defaultThreshold: 10 },
  refund: { label: "refund an order", unit: "taka", defaultThreshold: 3000 },
  price: { label: "change a price", unit: "taka", defaultThreshold: 500 },
  cancel: {
    label: "cancel an order",
    unit: "choice",
    conditions: ["that has already shipped", "at all"],
  },
  reply: {
    label: "reply to a customer",
    unit: "choice",
    conditions: ["who sounds upset", "who asks for a person", "who is complaining publicly"],
  },
  message: {
    label: "send a message",
    unit: "choice",
    conditions: ["after the conversation went quiet", "at all"],
  },
};

export const guardrails: Guardrail[] = [
  { id: "G-1", action: "discount", condition: "more than 10%", threshold: 10, outcome: "ask", enabled: true, stoppedThisWeek: 34 },
  { id: "G-2", action: "refund", condition: "more than ৳3,000", threshold: 3000, outcome: "ask", enabled: true, stoppedThisWeek: 21 },
  { id: "G-3", action: "reply", condition: "who asks for a person", outcome: "handoff", enabled: true, stoppedThisWeek: 18 },
  { id: "G-4", action: "reply", condition: "who sounds upset", outcome: "handoff", enabled: true, stoppedThisWeek: 9 },
  { id: "G-5", action: "cancel", condition: "that has already shipped", outcome: "ask", enabled: true, stoppedThisWeek: 6 },
  { id: "G-6", action: "price", condition: "more than ৳500", threshold: 500, outcome: "block", enabled: true, stoppedThisWeek: 2 },
  { id: "G-7", action: "discount", condition: "more than 5%", threshold: 5, outcome: "ask", enabled: false, stoppedThisWeek: 0 },
];

export const platformGuardrails: Guardrail[] = [
  { id: "P-1", action: "message", condition: "outside the 24-hour reply window", outcome: "block", enabled: true, locked: true, lockedReason: "Meta does not allow it, so neither do we.", stoppedThisWeek: 12 },
  { id: "P-2", action: "message", condition: "to someone who opted out", outcome: "block", enabled: true, locked: true, lockedReason: "Opting out is final, everywhere.", stoppedThisWeek: 3 },
];

export interface ToolDef {
  name: string;
  /** What a shop owner would call it. This is what the interface shows. */
  label: string;
  description: string;
  scopes: AgentRole[];
  mutating: boolean;
  gatedBy?: string;
  callsToday: number;
}

export const toolCatalog: ToolDef[] = [
  { name: "search_products", label: "Look up a product", description: "Search the catalogue by name, category or price.", scopes: ["sales", "retention"], mutating: false, callsToday: 1284 },
  { name: "check_inventory", label: "Check stock", description: "Read what is actually left of an item right now.", scopes: ["sales", "retention", "operations"], mutating: false, callsToday: 942 },
  { name: "get_order_status", label: "Check an order", description: "Look up an order by number or phone, with where it is.", scopes: ["support", "operations"], mutating: false, callsToday: 806 },
  { name: "search_knowledge_base", label: "Look something up", description: "Search your policies, FAQs and product notes.", scopes: ["sales", "support", "retention"], mutating: false, callsToday: 1477 },
  { name: "check_return_eligibility", label: "Check if it can be returned", description: "Test an order against the return window and condition.", scopes: ["support"], mutating: false, callsToday: 143 },
  { name: "create_payment_link", label: "Send a checkout link", description: "Start an order and send the customer a way to pay.", scopes: ["sales"], mutating: true, callsToday: 218 },
  { name: "apply_discount", label: "Give a discount", description: "Take a percentage off an order that has not been paid yet.", scopes: ["sales", "retention"], mutating: true, gatedBy: "G-1", callsToday: 96 },
  { name: "recover_cart", label: "Send a cart reminder", description: "Nudge someone who left something behind, if the window allows.", scopes: ["retention"], mutating: true, gatedBy: "P-1", callsToday: 64 },
  { name: "send_restock_alert", label: "Send a restock alert", description: "Tell people waiting on an item that it is back.", scopes: ["retention"], mutating: true, gatedBy: "P-1", callsToday: 31 },
  { name: "issue_refund", label: "Refund an order", description: "Send money back, in full or in part.", scopes: ["manager"], mutating: true, gatedBy: "G-2", callsToday: 24 },
  { name: "approve_exception", label: "Approve an exception", description: "Allow a one-off departure from your own rules.", scopes: ["manager"], mutating: true, gatedBy: "G-2", callsToday: 9 },
  { name: "sync_inventory", label: "Update stock", description: "Count an item down when it sells, and back up when it returns.", scopes: ["operations"], mutating: true, callsToday: 48 },
  { name: "update_crm_contact", label: "Save a customer", description: "Remember a customer's name, phone and address for next time.", scopes: ["operations"], mutating: true, callsToday: 176 },
  { name: "handoff_to_human", label: "Hand over to a person", description: "Pass the conversation to a teammate with the full history.", scopes: ["manager", "support"], mutating: true, callsToday: 38 },
];

/** Labels for the classifier steps, which are not in the catalogue above. */
const extraActionLabels: Record<string, string> = {
  classify_intent: "Read what they want",
  detect_language: "Work out the language",
  score_sentiment: "Judge the mood",
  approve_discount: "Approve a discount",
  check_logistics: "Check with the courier",
};

/** Plain-language name for any action. The interface never shows the internal name. */
export const actionLabel = (name: string) =>
  toolCatalog.find((t) => t.name === name)?.label ??
  extraActionLabels[name] ??
  name.replace(/_/g, " ");

export interface GatewayEvent {
  id: string;
  time: string;
  tool: string;
  agent: AgentRole;
  outcome: Outcome;
  detail: string;
  latencyMs: number;
  policy?: string;
  conversationId?: string;
}

export const gatewayLog: GatewayEvent[] = [
  { id: "g1", time: "10:41:22", tool: "get_order_status", agent: "support", outcome: "allowed", detail: "ORD-9317 → shipped · Pathao BD00182917", latencyMs: 380, conversationId: "CV-220" },
  { id: "g2", time: "10:41:05", tool: "search_products", agent: "sales", outcome: "allowed", detail: "jamdani saree → 1 match", latencyMs: 240, conversationId: "CV-221" },
  { id: "g3", time: "10:40:58", tool: "apply_discount", agent: "sales", outcome: "blocked", detail: "15% asked for · your limit is 10% · sent to you", latencyMs: 8, policy: "P-01", conversationId: "CV-219" },
  { id: "g4", time: "10:40:41", tool: "create_payment_link", agent: "sales", outcome: "allowed", detail: "Draft order · ৳3,890 · link issued", latencyMs: 640, conversationId: "CV-221" },
  { id: "g5", time: "10:40:30", tool: "issue_refund", agent: "manager", outcome: "approved", detail: "ORD-9310 · ৳2,450 · approved by Ayesha Karim", latencyMs: 940, policy: "P-02", conversationId: "CV-216" },
  { id: "g6", time: "10:40:12", tool: "sync_inventory", agent: "operations", outcome: "allowed", detail: "Silk Dupatta → 40 back in stock", latencyMs: 1120 },
  { id: "g7", time: "10:39:58", tool: "get_order_status", agent: "support", outcome: "fallback", detail: "Courier API 3.2s · static reply sent, thread flagged", latencyMs: 3210, policy: "P-06" },
  { id: "g8", time: "10:39:31", tool: "recover_cart", agent: "retention", outcome: "blocked", detail: "24h window closed 11m ago · send suppressed", latencyMs: 6, policy: "P-05" },
  { id: "g9", time: "10:39:02", tool: "search_knowledge_base", agent: "support", outcome: "allowed", detail: "return policy COD → 3 chunks · top 0.97", latencyMs: 210 },
  { id: "g10", time: "10:38:44", tool: "handoff_to_human", agent: "manager", outcome: "allowed", detail: "CV-216 → Ayesha Karim · context attached", latencyMs: 190, conversationId: "CV-216" },
];

export const outcomeMeta: Record<Outcome, { label: string; tone: string; dot: string }> = {
  allowed: { label: "Allowed", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  blocked: { label: "Blocked", tone: "bg-block-soft text-block-ink", dot: "bg-block" },
  approved: { label: "Approved", tone: "bg-machine-soft text-machine-ink", dot: "bg-machine" },
  fallback: { label: "Fallback", tone: "bg-pend-soft text-pend-ink", dot: "bg-pend" },
};

/** The four checks every proposed action passes through, in order. */
export const gatewayStages = [
  { key: "validate", label: "Valid", detail: "Known action, arguments the right shape" },
  { key: "role", label: "Allowed", detail: "This agent holds this action" },
  { key: "policy", label: "Within limits", detail: "The merchant's rules permit these values" },
  { key: "execute", label: "Run", detail: "Do it, then check the result" },
];

/* -------------------------------- Analytics ------------------------------ */

export const revenueSeries = [
  { day: "04 Aug", revenue: 18200, orders: 14 },
  { day: "05 Aug", revenue: 22400, orders: 18 },
  { day: "06 Aug", revenue: 16800, orders: 12 },
  { day: "07 Aug", revenue: 29100, orders: 22 },
  { day: "08 Aug", revenue: 25300, orders: 19 },
  { day: "09 Aug", revenue: 31800, orders: 26 },
  { day: "10 Aug", revenue: 36400, orders: 31 },
  { day: "11 Aug", revenue: 40200, orders: 33 },
];

export const funnel = [
  { stage: "Comments", value: 86, note: "on the last post" },
  { stage: "DMs opened", value: 41, note: "compliant private replies" },
  { stage: "Qualified", value: 26, note: "intent confirmed by Sales" },
  { stage: "Checkout links", value: 18, note: "draft orders created" },
  { stage: "Paid orders", value: 11, note: "payment captured" },
];

export const channelMix = [
  { name: "Instagram", value: 46 },
  { name: "Messenger", value: 28 },
  { name: "WhatsApp", value: 19 },
  { name: "Web chat", value: 7 },
];

export const languageMix = [
  { name: "Banglish", value: 52 },
  { name: "Bangla", value: 27 },
  { name: "English", value: 21 },
];

export const kpis = {
  conversationsToday: 38,
  revenueAttributed: 9400,
  containment: 81.2,
  avgResponse: 1.1,
  approvalsWaiting: 2,
};

/**
 * Figures published by others, carried from research/ so the demo can show a target
 * line without ever claiming it as an achieved result. Always label these on screen.
 */
export const benchmarkFor = (label: string) => {
  const found = industryBenchmarks.find((b) => b.label === label);
  if (!found) throw new Error(`No industry benchmark recorded for "${label}"`);
  return found;
};

export const industryBenchmarks = [
  { label: "AI containment rate", range: "75–90%", source: "2026 industry benchmarks · research/05" },
  { label: "DM-to-order conversion", range: "~12.3%", source: "2026 industry benchmarks · research/05" },
  { label: "Abandoned-cart recovery", range: "30–35%", source: "2026 industry benchmarks · research/05" },
  { label: "Banglish sentiment accuracy", range: "~67%", source: "Fine-tuned Llama-3-8B · research/03" },
];

/* ------------------------------ Integrations ----------------------------- */

export type IntegrationBrand =
  | "instagram"
  | "messenger"
  | "whatsapp"
  | "web"
  | "logistics";

export interface Integration {
  id: string;
  name: string;
  brand: IntegrationBrand;
  kind: "channel" | "logistics";
  status: "connected" | "available" | "attention";
  account: string;
  description: string;
  scopes: string[];
  lastEvent?: string;
  note?: string;
}

export const integrations: Integration[] = [
  { id: "ig", name: "Instagram", brand: "instagram", kind: "channel", status: "connected", account: "@athelier", description: "Comments, DMs, story replies and compliant private replies.", scopes: ["instagram_manage_messages", "instagram_manage_comments", "pages_messaging"], lastEvent: "comment · 12s ago" },
  { id: "fb", name: "Facebook Messenger", brand: "messenger", kind: "channel", status: "connected", account: "Athelier", description: "Page conversations and comment triggers on Page posts.", scopes: ["pages_messaging", "pages_read_engagement"], lastEvent: "message · 4m ago" },
  { id: "wa", name: "WhatsApp Business", brand: "whatsapp", kind: "channel", status: "connected", account: "+880 1XXX-XXXXXX", description: "Cloud API with approved utility templates for order updates.", scopes: ["whatsapp_business_messaging", "whatsapp_business_management"], lastEvent: "message · 32m ago" },
  { id: "web", name: "Web chat", brand: "web", kind: "channel", status: "available", account: "Not installed", description: "A chat box for a website, if you ever get one. Same agents behind it.", scopes: [] },
  { id: "pathao", name: "Pathao", brand: "logistics", kind: "logistics", status: "connected", account: "Dhaka Metro", description: "Books the pickup and tracks the parcel for Dhaka deliveries.", scopes: ["orders.read", "orders.write"], lastEvent: "status · 6m ago" },
  { id: "steadfast", name: "Steadfast", brand: "logistics", kind: "logistics", status: "attention", account: "Outside Dhaka", description: "Nationwide, for anything going outside Dhaka.", scopes: ["orders.read"], note: "Took 3.2 seconds to answer on the last check, over the 3 second limit. A slow courier gets a careful reply rather than a wrong one." },
  { id: "redx", name: "RedX", brand: "logistics", kind: "logistics", status: "available", account: "Not connected", description: "Reaches more upazilas than the others, if you sell outside the cities.", scopes: [] },
];

export const formatBDT = (n: number) => `৳${n.toLocaleString("en-IN")}`;

/**
 * Above a lakh, Bangladeshi readers do arithmetic in lakh and crore. Rendering
 * ৳42,00,000 forces a mental conversion that ৳42 lakh does not, and reading a
 * large figure in Western grouping is the fastest way to look like an outsider.
 */
export const formatBDTScale = (n: number) => {
  if (n >= 10_000_000) {
    const v = n / 10_000_000;
    return `৳${v % 1 === 0 ? v : v.toFixed(1)} crore`;
  }
  if (n >= 100_000) {
    const v = n / 100_000;
    return `৳${v % 1 === 0 ? v : v.toFixed(1)} lakh`;
  }
  return formatBDT(n);
};

export const formatCompact = (n: number) =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
