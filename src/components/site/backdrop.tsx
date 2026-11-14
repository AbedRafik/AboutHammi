"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed backdrop: a living Vanta.fog WebGL scene (three.js r134 +
 * vanta.fog, both vendored under /vendor so the site stays self-hosted
 * and CSP-clean) drifting behind the whole page, with the exact fog
 * recipe requested per theme:
 *
 *   dark:  highlight 0x9f0a2a, midtone 0x580a16, lowlight 0xffffff,
 *          base 0x0
 *   light: highlight 0xf0b4be, midtone 0xb2122e, lowlight 0x0,
 *          base 0xffffff
 *
 * with blurFactor 0.55, speed 0.90, zoom 1.10, mouse and touch controls
 * on, gyro off. The fog follows the pointer, so the background itself is
 * an interactive layer.
 *
 * There is NO static image anywhere: the base layer under the canvas is
 * a pure-CSS fog gradient (see .backdrop in globals.css), so the page
 * never shows a frozen artwork that a canvas later swaps out. The scene
 * scripts are preloaded in <head> and start initializing the moment
 * hydration runs - DURING the loader, which is transparent glass - and
 * the canvas fades in over the gradient the instant its first frame is
 * rendered (data-fog-live), so the visitor literally watches the fog
 * come alive. No-WebGL, no-JS, and reduced-motion visitors simply keep
 * the gradient. A theme-aware scrim over both keeps text contrast, and
 * the scene re-initializes with the other palette when the theme flips
 * (observing the class next-themes writes before first paint).
 */

type VantaEffect = { destroy: () => void };

/* The site's fog palettes: premium dark crimson in both appearances.
 * NOTE on the dark midtone: 0x64 is NOT "gray 100" here, THREE.Color
 * reads it as the hex #000064 (deep blue). Under the old violet
 * identity that blue midtone was invisible inside the family; against
 * a crimson highlight it MIXED into stray purple patches, so the
 * midtone is now a deep wine that keeps the whole blend red. */
const FOG_PRESETS = {
  dark: {
    highlightColor: 0x9f0a2a,
    midtoneColor: 0x580a16,
    lowlightColor: 0xffffff,
    baseColor: 0x0,
  },
  light: {
    highlightColor: 0xf0b4be,
    midtoneColor: 0xb2122e,
    lowlightColor: 0x0,
    baseColor: 0xffffff,
  },
} as const;

/* Loads the vendored bundles once per page, three before vanta (vanta
   expects a global THREE). Cached so a theme re-init never refetches. */
let scriptsPromise: Promise<void> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.head.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(src)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "1";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error(src)), { once: true });
    document.head.appendChild(script);
  });
}

function loadVanta(basePath: string) {
  if (!scriptsPromise) {
    scriptsPromise = (async () => {
      await loadScript(`${basePath}/vendor/three.r134.min.js`);
      await loadScript(`${basePath}/vendor/vanta.fog.min.js`);
    })().catch((error) => {
      /* Reset so a later theme flip can retry (e.g. transient offline). */
      scriptsPromise = null;
      throw error;
    });
  }
  return scriptsPromise;
}

export function Backdrop() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const hostRef = useRef<HTMLDivElement>(null);

  /* The loader screens the site until the living fog has actually
     RENDERED, so the first thing visitors see is the finished scene.
     These signals tell it when that happened (or never will: reduced
     motion/transparency visitors, WebGL failures, unreachable scripts).
     Signaled at most once per page; the theme-flip re-init stays
     silent. */
  const signalFog = (ready: boolean) => {
    const doc = document.documentElement;
    if (doc.hasAttribute("data-fog-signaled")) return;
    doc.setAttribute("data-fog-signaled", "");
    if (ready) {
      /* Separate flag, set ONLY on a real rendered frame: the CSS fades
         the canvas in over the gradient base (a hard canvas pop would
         be its own swap, exactly what this backdrop must avoid). */
      doc.setAttribute("data-fog-live", "");
    }
    doc.dispatchEvent(new CustomEvent(ready ? "fog-ready" : "fog-fail"));
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /* The living scene only exists for visitors who can enjoy it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      signalFog(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) {
      signalFog(false);
      return;
    }

    let cancelled = false;
    let effect: VantaEffect | null = null;
    let observer: MutationObserver | null = null;

    const init = () => {
      const w = window as typeof window & {
        VANTA?: { FOG?: (options: Record<string, unknown>) => VantaEffect };
      };
      if (!w.VANTA?.FOG) return;
      const preset = document.documentElement.classList.contains("dark")
        ? FOG_PRESETS.dark
        : FOG_PRESETS.light;
      try {
        effect?.destroy();
        effect = w.VANTA.FOG({
          el: host,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          blurFactor: 0.55,
          speed: 0.9,
          zoom: 1.1,
          ...preset,
        });
        /* Vanta draws its first frame on its own animation loop: after
           two of our frames the canvas has size AND paint, which is
           exactly what the loader is waiting for. */
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (cancelled) return;
            const canvas = host.querySelector("canvas");
            signalFog(!!canvas && canvas.width > 0 && canvas.height > 0);
          }),
        );
      } catch {
        /* WebGL unavailable: the CSS fog gradient stays as the page. */
        signalFog(false);
      }
    };

    loadVanta(basePath)
      .then(() => {
        if (cancelled) return;
        init();
        /* Re-init when the theme class flips; the class is written
           before first paint by next-themes, so reading it directly is
           reliable at init time. */
        observer = new MutationObserver(() => {
          if (!cancelled) init();
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      })
      .catch(() => {
        /* Scripts unreachable: the CSS fog gradient stays as the page. */
        signalFog(false);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      effect?.destroy();
    };
  }, [basePath]);

  return (
    <div aria-hidden className="backdrop">
      <div ref={hostRef} className="vanta-host" />
      <div className="backdrop-scrim" />
    </div>
  );
}
