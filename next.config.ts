import type { NextConfig } from "next";

/**
 * Two build modes:
 *
 * 1. Default mode: a standard Next.js build. This is what Vercel and
 *    `next start` use; hosts pick it up with zero configuration.
 * 2. Static export mode: set GITHUB_PAGES=1 and the site builds as a
 *    static export into ./out, ready for GitHub Pages.
 *    NEXT_PUBLIC_BASE_PATH sets the repository sub-path (for a project
 *    site such as username.github.io/repo-name). The deploy workflow
 *    sets it automatically; leave it empty for a username.github.io
 *    root site or local development.
 */
const isGithubPages = process.env.GITHUB_PAGES === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Security headers for server mode. GitHub Pages cannot set HTTP headers,
 * so in static export mode the equivalent protections that work in a meta
 * tag (Content-Security-Policy, referrer policy) are rendered in the
 * document head by src/app/layout.tsx instead.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      }),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  /* Dev server: the sandbox preview proxy requests assets cross-origin,
     which Next 16 flags unless the origin is allow-listed. */
  allowedDevOrigins: ["*.space-z.ai"],
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
