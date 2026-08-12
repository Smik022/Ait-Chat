/**
 * Brand marks in their own colours.
 *
 * These are simplified marks drawn here, used nominatively to identify the service
 * each integration connects to. Two things to settle before this is public:
 *
 *   1. Replace them with the official assets from each vendor's brand resource centre.
 *      Meta publishes exact geometry and requires a minimum size of 16px with clear
 *      space of a quarter of the mark's width on all sides; Instagram's real gradient
 *      stops ship only inside its signed asset pack, so the values below are the
 *      widely-used approximation, not the official ones.
 *   2. Never build a lockup that implies partnership ("Powered by WhatsApp"), and keep
 *      the WhatsApp mark from being the most prominent element on any screen.
 *
 * Marks without a brand of their own (web, courier, CRM) inherit `currentColor`.
 */

type LogoProps = { className?: string };

const base = "shrink-0";

export function InstagramMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <defs>
        <linearGradient id="ait-ig" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFDC80" />
          <stop offset="0.2" stopColor="#F58529" />
          <stop offset="0.45" stopColor="#DD2A7B" />
          <stop offset="0.75" stopColor="#8134AF" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect
        x="2.6"
        y="2.6"
        width="18.8"
        height="18.8"
        rx="5.4"
        fill="none"
        stroke="url(#ait-ig)"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#ait-ig)" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.25" fill="url(#ait-ig)" />
    </svg>
  );
}

export function MessengerMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <defs>
        <linearGradient id="ait-msgr" x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#006AFF" />
          <stop offset="1" stopColor="#00C6FF" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.9c-5.6 0-10 4.1-10 9.65 0 3.16 1.43 5.97 3.66 7.8v4.03l3.35-1.84c.9.25 1.85.38 2.99.38 5.6 0 10-4.1 10-9.65C22 6 17.6 1.9 12 1.9Z"
        fill="url(#ait-msgr)"
      />
      <path
        d="m6.35 14.72 3.32-3.53a.6.6 0 0 1 .85-.03l1.72 1.55 2.5-1.68a.6.6 0 0 1 .77.9l-3.32 3.53a.6.6 0 0 1-.85.03l-1.72-1.55-2.5 1.68a.6.6 0 0 1-.77-.9Z"
        fill="#fff"
      />
    </svg>
  );
}

export function WhatsAppMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M2.6 21.4 4 16.9a9 9 0 1 1 3.45 3.3L2.6 21.4Z"
        fill="#25D366"
      />
      <path
        d="M9.25 7.95c.17-.38.35-.42.58-.42h.49c.17 0 .4.03.58.44l.63 1.51c.1.25.12.46 0 .67l-.3.44c-.12.19-.25.32-.06.61.38.63.9 1.34 1.58 1.95.75.67 1.41.94 1.76 1.11.23.11.42.06.57-.08l.52-.59c.17-.2.36-.16.58-.08l1.34.63c.23.11.37.17.42.27.05.11.05.58-.17 1.03-.21.46-.98.9-1.36.94-.38.04-.73.19-2.47-.53-2.08-.84-3.4-2.98-3.5-3.12-.11-.15-.84-1.13-.84-2.16 0-1.03.55-1.53.74-1.74Z"
        fill="#fff"
      />
    </svg>
  );
}

export function ShopifyMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M15.6 4.6a.4.4 0 0 0-.36-.34c-.15-.01-3.02-.23-3.02-.23s-2-1.99-2.22-2.2c-.22-.22-.65-.15-.82-.1L8.3 2.1C7.85 1.35 7.24.7 6.42.7c-.06 0-.12 0-.19.02C5.72.13 5.14 0 4.66 0 2.2 0 1.02 3.07.65 4.63c-.9.28-1.6.5-1.68.53"
        fill="none"
      />
      <path
        d="M18.7 5.55a.35.35 0 0 0-.31-.3l-2.62-.2-1.93-1.92a.78.78 0 0 0-.7-.18l-.86.26C12 2.3 11.4 1.6 10.5 1.6c-.25 0-.5.05-.74.15C9.2 1.1 8.5.8 7.7.8 6 .8 4.7 2.6 4 5.2l-1.8.56c-.56.17-.58.19-.65.72L0 21.1l13.2 2.5 7.5-1.85s-2-15.8-2-16.2Z"
        fill="#95BF47"
      />
      <path
        d="M18.39 5.25 15.77 5.05l-1.93-1.92a.5.5 0 0 0-.27-.13V23.6l7.5-1.85s-2-15.8-2-16.2a.35.35 0 0 0-.31-.3Z"
        fill="#5E8E3E"
      />
      <path
        d="m13.2 9.2-.9 2.68s-.8-.42-1.75-.42c-1.4 0-1.48.88-1.48 1.1 0 1.2 3.15 1.67 3.15 4.5 0 2.24-1.42 3.68-3.33 3.68-2.3 0-3.46-1.43-3.46-1.43l.61-2.04s1.2 1.04 2.22 1.04c.66 0 .93-.53.93-.91 0-1.58-2.58-1.65-2.58-4.24 0-2.18 1.57-4.3 4.73-4.3 1.22 0 1.86.35 1.86.35Z"
        fill="#fff"
      />
    </svg>
  );
}

export function WooCommerceMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M2.4 5.4h19.2c1 0 1.8.8 1.8 1.8v6c0 1-.8 1.8-1.8 1.8H15L15.9 19l-4.3-4H2.4c-1 0-1.8-.8-1.8-1.8v-6c0-1 .8-1.8 1.8-1.8Z"
        fill="#7F54B3"
      />
      <path
        d="M3.4 8.1c.14-.2.36-.3.64-.32.52-.04.81.2.88.72.3 2 .62 3.7.98 5.1l2.15-4.1c.2-.37.44-.57.73-.59.42-.03.69.24.79.8.24 1.6.54 2.95.9 4.08.25-2.4.66-4.14 1.24-5.2.15-.29.38-.43.67-.45.24-.02.45.05.64.2.19.15.29.34.31.57a.66.66 0 0 1-.11.44c-.37.68-.67 1.81-.91 3.38-.23 1.52-.31 2.7-.26 3.55.02.23-.02.44-.12.62a.63.63 0 0 1-.52.34c-.24.02-.49-.09-.73-.33-.87-.88-1.55-2.2-2.06-3.95-.6 1.2-1.05 2.09-1.35 2.68-.55 1.06-1.02 1.6-1.41 1.63-.25.02-.47-.19-.65-.63-.46-1.19-.96-3.5-1.5-6.9-.03-.24.02-.45.17-.63Z"
        fill="#fff"
      />
      <path
        d="M21.3 9.6c-.33-.58-.82-.93-1.48-1.06a1.9 1.9 0 0 0-.39-.04c-.88 0-1.6.46-2.16 1.38a4.86 4.86 0 0 0-.71 2.6c0 .73.15 1.36.46 1.88.33.58.82.93 1.48 1.06.14.03.27.04.39.04.89 0 1.61-.46 2.16-1.38.31-.53.55-1.4.71-2.61.05-.36.07-.7.07-1-.01-.73-.16-1.35-.53-1.87Zm-1.31 2.56c-.13.6-.36 1.05-.7 1.35-.27.24-.51.34-.74.29-.22-.04-.4-.24-.54-.58a2.3 2.3 0 0 1-.16-.82c0-.24.02-.48.07-.7.09-.4.25-.79.5-1.16.31-.46.63-.65.96-.59.22.05.4.24.54.58.11.25.16.52.16.82 0 .25-.03.49-.09.71ZM16.05 9.6c-.33-.58-.83-.93-1.48-1.06a1.9 1.9 0 0 0-.39-.04c-.88 0-1.6.46-2.16 1.38a4.86 4.86 0 0 0-.71 2.6c0 .73.15 1.36.46 1.88.33.58.82.93 1.48 1.06.14.03.27.04.39.04.89 0 1.61-.46 2.16-1.38.31-.53.55-1.4.71-2.61.05-.36.07-.7.07-1 0-.73-.16-1.35-.53-1.87Zm-1.32 2.56c-.13.6-.36 1.05-.7 1.35-.27.24-.51.34-.74.29-.22-.04-.4-.24-.54-.58a2.3 2.3 0 0 1-.16-.82c0-.24.02-.48.07-.7.09-.4.25-.79.5-1.16.31-.46.63-.65.96-.59.22.05.4.24.54.58.11.25.16.52.16.82.01.25-.02.49-.09.71Z"
        fill="#fff"
      />
    </svg>
  );
}

export function GlobeMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="4.1" ry="9.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TruckMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M2.8 6.5h10.4v9.2H2.8zM13.2 9.6h3.9l3.1 3v3.1h-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17.6" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="17.6" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CrmMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <circle cx="17.2" cy="6.4" r="2.9" fill="none" stroke="#FF7A59" strokeWidth="1.9" />
      <circle cx="6.2" cy="12" r="3.1" fill="#FF7A59" />
      <circle cx="16.4" cy="18.2" r="3.4" fill="none" stroke="#FF7A59" strokeWidth="1.9" />
      <path
        d="m9 10.7 5.2-3M9.2 13.6l4.4 2.7"
        stroke="#FF7A59"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ----------------------------- Model providers --------------------------- */

export function OpenAIMark({ className }: LogoProps) {
  // OpenAI's mark is genuinely monochrome, so it inherits the surface colour.
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M12 2.6a4 4 0 0 1 3.46 2l3.02 5.23a4 4 0 0 1 0 4l-3.02 5.23a4 4 0 0 1-3.46 2H12a4 4 0 0 1-3.46-2l-3.02-5.23a4 4 0 0 1 0-4L8.54 4.6a4 4 0 0 1 3.46-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7.7 15.7 9.85v4.3L12 16.3l-3.7-2.15v-4.3L12 7.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AnthropicMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M8.4 4.3h3.3l5.6 15.4h-3.4l-1.15-3.3H6.6l-1.15 3.3H2.1L8.4 4.3Zm.55 4.1L7.4 13.1h3.1L8.95 8.4Z"
        fill="#D97757"
      />
      <path d="M15.4 4.3h3.35L22 13.2h-3.35L15.4 4.3Z" fill="#D97757" opacity="0.6" />
    </svg>
  );
}

export function GeminiMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <defs>
        <linearGradient id="ait-gem" x1="3" y1="20" x2="21" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.2c.35 4.05 1.6 6.55 3.4 8.05 1.2 1 3 1.5 6.4 1.75-3.4.25-5.2.75-6.4 1.75-1.8 1.5-3.05 4-3.4 8.05-.35-4.05-1.6-6.55-3.4-8.05-1.2-1-3-1.5-6.4-1.75 3.4-.25 5.2-.75 6.4-1.75C10.4 8.75 11.65 6.25 12 2.2Z"
        fill="url(#ait-gem)"
      />
    </svg>
  );
}

export function GoogleMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.41 13.92a5.99 5.99 0 0 1 0-3.83V7.48H3.06a10 10 0 0 0 0 9.04l3.35-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.06 7.48l3.35 2.6C7.2 7.74 9.4 5.98 12 5.98Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* --------------------------------- Lookup -------------------------------- */

export const brandMarks = {
  instagram: InstagramMark,
  messenger: MessengerMark,
  whatsapp: WhatsAppMark,
  shopify: ShopifyMark,
  woocommerce: WooCommerceMark,
  web: GlobeMark,
  logistics: TruckMark,
  crm: CrmMark,
  openai: OpenAIMark,
  anthropic: AnthropicMark,
  gemini: GeminiMark,
} as const;

export type BrandKey = keyof typeof brandMarks;

export function BrandMark({
  brand,
  className,
}: {
  brand: BrandKey;
  className?: string;
}) {
  const Mark = brandMarks[brand];
  return <Mark className={className} />;
}
