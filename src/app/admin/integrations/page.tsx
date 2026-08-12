"use client";

import { useState } from "react";
import {
  ArrowRight,
  Database,
  Globe,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f58529" />
          <stop offset="0.35" stopColor="#dd2a7b" />
          <stop offset="0.7" stopColor="#8134af" />
          <stop offset="1" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="url(#ig-gradient)" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4" stroke="url(#ig-gradient)" strokeWidth="1.9" />
      <circle cx="17" cy="6.8" r="1.2" fill="url(#ig-gradient)" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path d="M13.6 8.2h1.6V6.1h-1.8c-2 0-3.4 1.2-3.4 3.5v1.8H8v2.2h1.9V18h2.3v-4.4H14l.4-2.2h-2.2v-1.4c0-.8.2-1.1 1.4-1.1Z" fill="#fff" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#25d366" />
      <path
        d="M8.5 16.1l.5-1.8a6.2 6.2 0 0 1-.9-3.2c0-3.3 2.7-6 6-6 3.1 0 5.6 2.4 5.6 5.5 0 3.4-2.7 6.1-6.1 6.1-1 .0-1.9-.2-2.8-.6l-2.3.6Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M9.8 9.6c.2-.4.4-.5.6-.5h.5c.2 0 .4.1.5.4l.6 1.3c.1.3.1.5 0 .7l-.3.4c-.1.2-.2.3 0 .6.2.4.7 1.2 1.5 1.9.8.8 1.6 1.2 2 1.4.2.1.4 0 .5-.1l.6-.4c.2-.1.4-.1.6 0l1.2.6c.2.1.3.3.3.5 0 .4-.2.8-.5 1-.4.4-.9.5-1.4.4-1-.2-2.2-.8-3.6-2.1-1.6-1.5-2.5-3.2-2.8-4.5-.1-.6 0-1.1.3-1.5Z"
        fill="#25d366"
      />
    </svg>
  );
}

function WordPressIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#21759b" />
      <path d="M6.8 7.7h2.1l1.4 5 1.1-3.5-.5-1.5h1.6l1.5 5 1.3-5h1.4l-2.1 7.8h-1.3l-1.6-5.1-1.5 5.1H9.3L6.8 7.7Z" fill="#fff" />
    </svg>
  );
}

function WebIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.9 12h18.2M12 2.9v18.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const providers = [
  {
    name: "Instagram",
    status: "Connected",
    description: "Comment-to-DM automation, shop replies, and reel lead capture.",
    icon: InstagramIcon,
    accent: "from-[#ffe8da] via-white to-white",
  },
  {
    name: "Facebook",
    status: "Connected",
    description: "Messenger support, lead routing, and campaign response handling.",
    icon: FacebookIcon,
    accent: "from-[#d8e7ff] via-white to-white",
  },
  {
    name: "WhatsApp",
    status: "Connected",
    description: "Order updates, catalog links, and human handoff from chat.",
    icon: WhatsAppIcon,
    accent: "from-[#d5f7e1] via-white to-white",
  },
  {
    name: "WordPress",
    status: "Ready",
    description: "Storefront sync, product data, and checkout embed hooks.",
    icon: WordPressIcon,
    accent: "from-[#ddeef8] via-white to-white",
  },
  {
    name: "Website",
    status: "Ready",
    description: "Live chat, lead forms, and product intents from your site.",
    icon: WebIcon,
    accent: "from-[#efeadf] via-white to-white",
  },
  {
    name: "Knowledge base",
    status: "Synced",
    description: "Grounding docs, FAQs, and policy files for agent retrieval.",
    icon: Database,
    accent: "from-[#edf1f2] via-white to-white",
  },
];

export default function IntegrationsPage() {
  const [activeProvider, setActiveProvider] = useState(providers[0]);
  const ActiveIcon = activeProvider.icon;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cde1d8] bg-[#edf7f1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5d45]">
              <Sparkles className="h-3.5 w-3.5" />
              Integration gallery
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111827]">Connect the channels that actually drive revenue</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4b5563]">
              Each card is interactive. Pick a channel to preview how the connector behaves, what it powers,
              and how it fits into the demo workflow.
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[#e7e2d7] bg-[#faf8f4] px-4 py-3">
            <div className="text-xs uppercase tracking-[0.16em] text-[#667085]">Connected channels</div>
            <div className="mt-1 text-2xl font-semibold text-[#111827]">{providers.length}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => {
          const isActive = activeProvider.name === provider.name;
          const Icon = provider.icon;

          return (
            <button
              key={provider.name}
              type="button"
              onClick={() => setActiveProvider(provider)}
              className={`rounded-[1.5rem] border bg-gradient-to-br p-4 text-left shadow-sm transition ${
                isActive
                  ? "border-[#0e5a43] bg-[#eff8f3]"
                  : "border-[#e7e2d7] bg-white hover:border-[#d5ddd5] hover:shadow-md"
              } ${provider.accent}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-sm ${provider.name === "WhatsApp" ? "text-[#25d366]" : provider.name === "Facebook" ? "text-[#1877f2]" : provider.name === "WordPress" ? "text-[#21759b]" : provider.name === "Website" ? "text-[#374151]" : "text-[#0d5d45]"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#111827]">{provider.name}</div>
                    <div className="mt-1 text-sm leading-6 text-[#667085]">{provider.description}</div>
                  </div>
                </div>
                <div className="rounded-full bg-[#ffffff]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45] ring-1 ring-[#e7e2d7]">
                  {provider.status}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Selected integration</div>
              <h3 className="mt-1 text-2xl font-semibold text-[#111827]">{activeProvider.name}</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf7f1] text-[#0d5d45]">
              <ActiveIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4 rounded-[1.4rem] border border-[#efe8df] bg-[#faf8f4] p-4">
            <div className="text-sm text-[#667085]">Status</div>
            <div className="mt-1 text-2xl font-semibold text-[#111827]">{activeProvider.status}</div>
            <p className="mt-3 text-sm leading-7 text-[#4b5563]">{activeProvider.description}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Surface", value: activeProvider.name === "Website" ? "Web chat + forms" : "Commerce inbox" },
              { label: "Primary use", value: activeProvider.name === "WordPress" ? "Store sync" : "Conversation routing" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#efe8df] bg-white p-3">
                <div className="text-xs uppercase tracking-[0.14em] text-[#667085]">{item.label}</div>
                <div className="mt-2 text-sm font-semibold text-[#111827]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Demo flow</div>
              <h3 className="mt-1 text-2xl font-semibold text-[#111827]">How the connector behaves</h3>
            </div>
            <Search className="h-5 w-5 text-[#0d5d45]" />
          </div>

          <div className="mt-4 space-y-3">
            {[
              "Connect channel credentials",
              "Sync catalog and policy data",
              "Route inbound messages into the agent stack",
              "Show handoff, actions, and audit logs live",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-[#efe8df] bg-[#faf8f4] p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e5a43] text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <div className="text-sm leading-6 text-[#374151]">{step}</div>
              </div>
            ))}
          </div>

          <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0e5a43] px-4 py-2 text-sm font-semibold text-white">
            Open provider demo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
