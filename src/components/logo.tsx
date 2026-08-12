import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="11" fill="url(#ait-mark)" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" stroke="white" strokeOpacity="0.18" />
      <path
        d="M20 9.5 29 28.5h-4.2L20 18.2l-4.8 10.3H11L20 9.5Z"
        fill="white"
      />
      <path
        d="M16.4 23.6h7.2l-3.6 4.9-3.6-4.9Z"
        fill="white"
        fillOpacity="0.75"
      />
      <defs>
        <linearGradient id="ait-mark" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1d7a5f" />
          <stop offset="0.55" stopColor="#0f5d46" />
          <stop offset="1" stopColor="#0a3d2f" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ className, variant = "wordmark" }: { className?: string; variant?: "wordmark" | "compact" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8" />
      {variant === "wordmark" && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Ait-Chat
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Social Commerce OS
          </span>
        </span>
      )}
    </span>
  );
}
