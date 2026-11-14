import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hammi Abou Houraira",
    short_name: "Hammi",
    description:
      "App designer and developer. Mobile apps built with React Native and published on Google Play, backed by Python and Django services.",
    start_url: basePath + "/",
    display: "standalone",
    background_color: "#f2f2f7",
    theme_color: "#f2f2f7",
    icons: [
      {
        src: basePath + "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: basePath + "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: basePath + "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
