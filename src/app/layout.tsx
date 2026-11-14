import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { AppLoader } from "@/components/site/app-loader";
import { LocaleProvider } from "@/components/site/providers";

/* Self-hosted fonts. The families are registered by these stylesheets and
   wired into the font chains in globals.css, so the site carries its own
   type and never depends on a third-party font CDN. Alexandria (a sharp,
   geometric, contemporary face with full Arabic support) carries the
   display voice; Readex Pro (its calmer text companion) carries the
   body. Both cover Arabic and Latin with one voice, so the site keeps a
   single identity across languages. */
import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/500.css";
import "@fontsource/readex-pro/600.css";
import "@fontsource/readex-pro/700.css";
import "@fontsource/alexandria/500.css";
import "@fontsource/alexandria/600.css";
import "@fontsource/alexandria/700.css";
import "@fontsource/alexandria/800.css";

import "./globals.css";

const SITE_URL = "https://hammi.is-a.dev";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hammi Abou Houraira | App Designer and Developer",
    template: "%s | Hammi Abou Houraira",
  },
  description:
    "App designer and developer. Mobile apps built with React Native and published on Google Play, Python and Django backends, and an interest in AI and user-centered app design.",
  applicationName: "Hammi Abou Houraira",
  authors: [{ name: "Hammi Abou Houraira", url: SITE_URL }],
  creator: "Hammi Abou Houraira",
  publisher: "Hammi Abou Houraira",
  keywords: [
    "Hammi Abou Houraira",
    "app developer",
    "app designer",
    "React Native developer",
    "Google Play developer",
    "Python developer",
    "Django developer",
    "mobile app developer",
    "portfolio",
  ],
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.svg`, type: "image/svg+xml" },
      { url: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: `${basePath}/manifest.webmanifest`,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Hammi Abou Houraira",
    title: "Hammi Abou Houraira | App Designer and Developer",
    description:
      "Mobile apps published on Google Play, Python and Django backends, and an interest in AI and user-centered app design.",
    locale: "en_US",
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1200,
        height: 630,
        alt: "Hammi Abou Houraira, app designer and developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammi Abou Houraira | App Designer and Developer",
    description:
      "Mobile apps published on Google Play, Python and Django backends, and an interest in AI and user-centered app design.",
    images: [`${basePath}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/* Runs before first paint: adopts the stored or browser locale so the
   document language and direction are correct immediately. For Arabic
   it also flags data-lang-ar: the loader's wordmark is SSR'd in the
   default locale (the server cannot know the visitor's), and CSS hides
   it until React hydrates with the real script - otherwise a first
   visit in Arabic would flash the Latin wordmark before it turns into
   the joined Arabic one. The string is fully static, so the inline
   script cannot inject anything. */
const localeBootstrap = `(function(){try{var s=null;try{s=localStorage.getItem("locale")}catch(e){}if(!s){var n=(navigator.language||"en").toLowerCase();s=n.indexOf("ar")===0?"ar":"en"}if(s!=="en"&&s!=="ar"){s="en"}var d=document.documentElement;d.lang=s;d.dir=s==="ar"?"rtl":"ltr";if(s==="ar"){d.setAttribute("data-lang-ar","")}}catch(e){}})()`;

/* Runs before first paint: marks the document as JS-enabled (which is
   what displays the app loader and arms the entrance wave, so no-JS
   visitors get the page immediately) and installs a safety net that
   force-releases the loader even if hydration never completes. The
   net sits at 10s, comfortably above the loader's own fog ceiling
   (8s): it exists purely for dead hydration, and must never cut a
   healthy fog-first wait short. The fallback also marks
   data-no-hydration, which is what un-hides BlurText words that no
   component will ever arm. */
const bootBootstrap = `(function(){try{var d=document.documentElement;d.classList.add("js");try{if(sessionStorage.getItem("hammi-visited")==="1"||window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-app-ready","")}}catch(e){}setTimeout(function(){if(!d.hasAttribute("data-app-ready")){d.setAttribute("data-app-ready","");d.setAttribute("data-no-hydration","")}},10000)}catch(e){}})()`;

/* Person structured data. Built only from constants defined here, never
   from user input, so the JSON-LD block is safe to inline. */
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hammi Abou Houraira",
  url: SITE_URL + "/",
  jobTitle: "App Designer and Developer",
  description:
    "App designer and developer. Mobile apps built with React Native and published on Google Play, backed by Python and Django services.",
  knowsAbout: [
    "React Native",
    "Python",
    "Django",
    "REST APIs",
    "App design",
    "KivyMD",
    "Qt5",
    "Linux",
  ],
  sameAs: [
    "https://github.com/hammi2",
    "https://github.com/abouhoraira2006",
    "https://www.linkedin.com/in/abou-horaira-75bb93377",
    "https://www.instagram.com/x_abou_hou_raira",
    "https://www.facebook.com/abouhoraira.hammi",
  ],
});

/* Content Security Policy. GitHub Pages serves static files and cannot set
   HTTP headers, so the policy ships as a meta tag. 'unsafe-inline' is
   required for scripts because a static Next.js export inlines its
   hydration payload. Dev mode is excluded so HMR keeps working. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
].join("; ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: bootBootstrap }} />
        {/* The fog scene's vendored bundles are the heavyweight assets of
            the page (three.js ~600 KB). Preloading them lets the living
            background start downloading before hydration, so it renders
            DURING the loader and is alive before the curtain lifts. */}
        <link rel="preload" as="script" href={`${basePath}/vendor/three.r134.min.js`} />
        <link rel="preload" as="script" href={`${basePath}/vendor/vanta.fog.min.js`} />
        {process.env.NODE_ENV === "production" ? (
          <>
            <meta httpEquiv="Content-Security-Policy" content={csp} />
            <meta name="referrer" content="strict-origin-when-cross-origin" />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
      </head>
      <body className="antialiased">
        {/* Liquid Glass physics, in two tiers (a full physics chain on
            every one of ~70 surfaces costs far more than a frame budget
            can afford, so the material is graded by stage size):

            #liquid-lens  HERO MATERIAL (header capsule, loader): full
              physics - chromatic dispersion (three refraction passes,
              one per wavelength: blue bends most, real IOR curve) +
              specular lighting from the slab's height field (the bevel
              glints, the flat face stays clean) + additive composite.
            #liquid-lens-lite  CARDS (every other .lg surface): one
              refraction pass through the same map - the physical lens
              without dispersion or lighting, at a third of the cost.
            Tiles and chips skip the lens entirely (their element-level
            frost is the real blur; a 40px surface shows no refraction
            anyway) - see .tile rules in globals.css.

            One packed asset drives both (public/lens-map.png, generated
            by scripts/generate_lens_map.py): R/G encode the refraction
            vectors of a slab with quarter-round beveled edges plus a
            subtle convex dome; B encodes the slab's height field for
            the lighting pass. colorInterpolationFilters must stay sRGB,
            otherwise the map's neutral gray (128) no longer means "no
            displacement". Engines that cannot resolve the reference
            (Safari's backdrop-filter has no SVG filter support) drop
            just this declaration and keep the frost on .lg itself. */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: "absolute" }}
        >
          <filter
            id="liquid-lens"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={`${basePath}/lens-map.png`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            {/* B -> alpha: the height field becomes the lighting input. */}
            <feColorMatrix
              in="map"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0"
              result="height"
            />
            {/* One refraction per wavelength: red least, blue most. */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="31"
              xChannelSelector="R"
              yChannelSelector="G"
              result="d-r"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="37"
              xChannelSelector="R"
              yChannelSelector="G"
              result="d-g"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="43"
              xChannelSelector="R"
              yChannelSelector="G"
              result="d-b"
            />
            {/* Keep only each pass's own wavelength. */}
            <feColorMatrix
              in="d-r"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="c-r"
            />
            <feColorMatrix
              in="d-g"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="c-g"
            />
            <feColorMatrix
              in="d-b"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="c-b"
            />
            {/* Recombine the dispersed spectrum. */}
            <feBlend in="c-r" in2="c-g" mode="screen" result="rg" />
            <feBlend in="rg" in2="c-b" mode="screen" result="refracted" />
            {/* Grazing light from the top-start: the bevel glints. */}
            <feSpecularLighting
              in="height"
              surfaceScale="7"
              specularConstant="1.3"
              specularExponent="14"
              lightingColor="#ffffff"
              result="spec"
            >
              <feDistantLight azimuth="235" elevation="18" />
            </feSpecularLighting>
            <feComposite
              in="refracted"
              in2="spec"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="0.9"
              k4="0"
            />
          </filter>
          {/* The card tier: same refraction physics, single pass. */}
          <filter
            id="liquid-lens-lite"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={`${basePath}/lens-map.png`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="32"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <AppLoader />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
