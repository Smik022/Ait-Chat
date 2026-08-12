export const formatBDT = (n: number) => `৳${n.toLocaleString("en-IN")}`;

export const formatCompact = (n: number) =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
