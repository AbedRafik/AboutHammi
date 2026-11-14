"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./providers";

/* Minimum time the loader stays visible: fast enough to never annoy,
   long enough for the wordmark to register and the progress bar to
   travel. First impressions get a little more room than pure speed. */
const MIN_SHOW_MS = 800;
/* Hard ceilings so a slow network can never trap the visitor behind the
   loader: fog and total wait. The fog gets by far the longest ceiling:
   it is the site's opening scene and the whole point of the loader. */
const FOG_TIMEOUT_MS = 8000;
const TOTAL_TIMEOUT_MS = 9000;
/* Repeat visits within the same session skip the loader: it plays once
   per arrival at the site, never on every refresh. */
const VISITED_KEY = "hammi-visited";

type Phase = "loading" | "exiting" | "gone";

/**
 * App loader. The loading stage shows ONLY three things: the living
 * fog, the grain, and a Liquid Glass capsule with the wordmark and a
 * progress bar. Everything else - header, hero, every panel - lives in
 * the .site-shell subtree, which CSS keeps visibility:hidden until
 * data-app-ready arrives, so the visitor sees nothing of the site
 * while it loads AND the browser rasterizes zero glass surfaces during
 * the wait (visibility skips the subtree at paint time; that is where
 * the loading cost actually goes). The fog scene initializes from the
 * first moment of hydration and renders BEHIND the capsule in full
 * view: loading IS watching the fog come alive, no placeholder image,
 * no post-load background swap.
 *
 * The end is strictly sequenced so nothing overlaps: the capsule
 * dissolves first (0.36s, scale + opacity - never a filter, which
 * would switch its own glass off mid-dissolve), and only after the
 * dissolve has fully finished does release() set data-app-ready, which
 * lifts the veil and fires the entrance wave in the same instant.
 *
 * Skipped entirely (page released instantly, veil never drops) when:
 * this visitor already landed once this session, the OS asks for
 * reduced motion, or the boot script's safety net already released
 * the page. Safety nets: the boot script shows the loader only when
 * JS runs (html.js) and force-releases at 10s for dead hydration, and
 * CSS hides any non-exiting loader once data-app-ready exists. Without
 * JS the loader never appears and the page is simply there.
 */
export function AppLoader() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0.12);

  useEffect(() => {
    const doc = document.documentElement;
    /* Hydration has caught up: from here every string is the visitor's
       own. data-hydrated is what lets CSS un-hide the Arabic wordmark
       (see the locale bootstrap in layout.tsx - the server cannot know
       the locale, so the SSR'd wordmark is Latin until this moment). */
    doc.setAttribute("data-hydrated", "");
    let visited = false;
    try {
      visited = sessionStorage.getItem(VISITED_KEY) === "1";
    } catch {
      /* storage unavailable: treat as a first visit */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const release = () => {
      try {
        sessionStorage.setItem(VISITED_KEY, "1");
      } catch {
        /* storage unavailable: the choice lives for this visit only */
      }
      doc.setAttribute("data-app-ready", "");
    };

    if (doc.hasAttribute("data-app-ready") || visited || reduced) {
      /* Skip path: release and vanish. This lives INSIDE run() (not
         straight in the effect body) so the state machine has a single
         entry point and the set-state-in-effect rule stays satisfied:
         every phase transition happens in the sequenced runner. */
      const skip = async () => {
        release();
        setPhase("gone");
      };
      skip();
      return;
    }

    let cancelled = false;
    const startedAt = performance.now();
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    /* Resolves when the fog scene reports itself rendered (or when it
       reports it will never render, or the ceiling hits). The scene
       starts loading the moment hydration runs - its scripts are
       preloaded in <head> - so this await rides on top of parallel
       work, it never starts it. */
    const waitForFog = () =>
      new Promise<void>((resolve) => {
        if (document.documentElement.hasAttribute("data-fog-signaled")) {
          return resolve();
        }
        const done = () => {
          clearTimeout(timer);
          document.removeEventListener("fog-ready", done);
          document.removeEventListener("fog-fail", done);
          resolve();
        };
        const timer = setTimeout(done, FOG_TIMEOUT_MS);
        document.addEventListener("fog-ready", done, { once: true });
        document.addEventListener("fog-fail", done, { once: true });
      });

    const run = async () => {
      setProgress(0.35);
      const fonts = document.fonts?.ready ?? Promise.resolve();
      await Promise.race([fonts, wait(TOTAL_TIMEOUT_MS)]);
      if (cancelled) return;
      setProgress(0.6);

      /* The priority wait: the living fog must render before the
         capsule lifts - and it renders BEHIND the capsule, in full
         view, while we wait. */
      await waitForFog();
      if (cancelled) return;
      setProgress(0.92);

      const elapsed = performance.now() - startedAt;
      await wait(Math.max(0, MIN_SHOW_MS - elapsed));
      if (cancelled) return;
      setProgress(1);
      await wait(180);

      if (cancelled) return;
      /* If the boot script's safety net already released the page (dead
         hydration then recovered, or a repeat visit that the boot script
         itself released), the loader is already hidden by CSS: vanish
         silently instead of playing the exit dissolve over the live
         page. */
      if (doc.hasAttribute("data-app-ready")) {
        setPhase("gone");
        return;
      }
      /* Strictly sequenced reveal, one stage at a time:
         1. NOW: the capsule dissolves (0.36s). The site shell is still
            veiled (html:not([data-app-ready]) .site-shell), so nothing
            of the page is visible yet - the visitor watches the loading
            message depart over the living fog.
         2. AFTER the dissolve has fully finished (400ms): release().
            data-app-ready lifts the veil and fires the entrance wave in
            the same instant, so the page opens with its animations on a
            clean stage. No overlap between the capsule's exit and the
            content's entrance. */
      setPhase("exiting");
      setTimeout(() => {
        if (cancelled) return;
        release();
        setPhase("gone");
      }, 400);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="app-loader"
      role="status"
      aria-label={t.loader}
      data-exiting={phase === "exiting" ? "true" : undefined}
      dir="ltr"
    >
      <span className="sr-only">{t.loader}</span>
      {/* A Liquid Glass capsule: the loader previews the site's material
          instead of covering it, so the fog renders through it, live.
          It carries the FULL physics lens (dispersion + specular) - the
          first surface visitors ever see is the material at its best. */}
      <div className="lg lens-full loader-capsule">
        <p className="loader-wordmark" aria-hidden>
          {/* Arabic is cursive: one span per letter would render the
             glyphs isolated AND laid out left-to-right inside this
             dir="ltr" root (a scrambled wordmark). Scripts that join
             animate as one unit instead; Latin keeps the per-letter
             stagger. */}
          {/[\u0600-\u06FF]/.test(t.brand) ? (
            <span
              className="loader-letter"
              dir="rtl"
              style={{ "--letter-d": "0ms" } as React.CSSProperties}
            >
              {t.brand}
            </span>
          ) : (
            [...t.brand].map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="loader-letter"
                style={{ "--letter-d": `${index * 55}ms` } as React.CSSProperties}
              >
                {letter}
              </span>
            ))
          )}
        </p>
        <div className="loader-track">
          <div className="loader-fill" style={{ scale: `${progress} 1` }} />
        </div>
      </div>
    </div>
  );
}
