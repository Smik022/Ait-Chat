import type { NextConfig } from "next";

/**
 * Published as a GitHub Pages *project* page at https://asifahmed.me/Ait-Chat/.
 *
 * The apex asifahmed.me belongs to the personal site repo, so this one is served
 * from the /Ait-Chat/ sub-path and needs basePath set. Without it every asset
 * resolves to /_next/... on the apex, which belongs to the other site, and the
 * page loads as bare HTML.
 *
 * There is deliberately no public/CNAME here. A CNAME in this repo would try to
 * claim the apex away from the personal site.
 */
// Only the published build needs the prefix. `next dev` stays on / so local work
// is unaffected. Override with NEXT_PUBLIC_BASE_PATH if the hosting path changes.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/Ait-Chat" : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
