import type { Metadata } from "next";
import { Inter, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ait-Chat · Social Commerce OS",
  description:
    "An AI agent workforce that turns Instagram, Facebook and WhatsApp conversations into completed orders, with every action checked by policy before it runs.",
};

const DIRECTION_CONTRACT = `<!--
IMPECCABLE DIRECTION CONTRACT · seed f1424203

THESIS: An operations control room for an AI agent workforce that sells. It refuses the
demo-grade dashboard: no decorative chart, no number without provenance, no capability
that cannot be watched actually running.

OWN-WORLD: Neutral zinc ground, hairline borders, shadows only on popovers. Primary
actions are near-black; the inherited logo green means live, allowed, paid. Amber pends,
red refuses, blue routes, violet marks machine authorship. Inter for text, Geist Mono for
every identifier and quantity, Noto Sans Bengali for Bangla. 8px radius, compact density.

STORY: The visitor watches a public comment become a private conversation become a paid
order, sees a rule refuse a refund that is over her limit, and believes the machine can be
trusted with money because they saw it stopped.

FIRST VIEWPORT: 248px sidebar left, liveness carried by the topbar's live/paused control.
Main opens on a four-metric strip in tabular numerals, then a split: the tool gateway's
decisions landing in real time on the left above the comment-to-order funnel, agent
workforce and the approval queue on the right. The gateway stream takes the left column
rather than a conversation feed because the refusal is the thesis, and the conversations
have a whole surface of their own one click away.

FORM: The category standard, taken as the standing exit over four dealt directions.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${notoSansBengali.variable} h-full`}
    >
      <body className="min-h-full">
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
