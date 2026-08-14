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
  web: GlobeMark,
  logistics: TruckMark,
  crm: CrmMark,
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
