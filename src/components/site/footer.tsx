"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "./providers";

export function Footer() {
  const { t } = useLocale();
  const ref = useRef<HTMLElement>(null);

  /* The hairline draws itself in when the footer scrolls into view
     (the arm/enter vocabulary of Reveal, kept local because the footer
     is not wrapped in one). No-JS and reduced-motion visitors simply
     see the line. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-armed");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    /* The page ends in fog: the mist layers sit at the footer's bottom
       edge (see .page-mist / .page-mist-veil in globals.css), so the
       last pixels of the page dissolve into soft violet haze. The top
       edge opens with a violet hairline that fades at both ends, a
       quiet echo of the kicker ticks. */
    <footer ref={ref} className="relative isolate mt-auto">
      <div aria-hidden className="footer-hair" />
      <div aria-hidden className="page-mist" />
      <div
        className="
          relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 px-5
          py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8
        "
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t.footer.thanks}
        </p>
        <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-foreground/80">
            © {new Date().getFullYear()} {t.name}. {t.footer.rights}
          </p>
          {/* Credits sit one tier below the copyright line (smaller,
              dimmer, but still clear over the page-end mist). */}
          <p className="text-[12px] text-muted-foreground">{t.footer.built}</p>
        </div>
      </div>
      <div aria-hidden className="page-mist-veil" />
    </footer>
  );
}
