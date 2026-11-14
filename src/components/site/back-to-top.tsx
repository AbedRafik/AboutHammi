"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "./providers";

/* The ring's geometry: a hairline circle at r=19 inside the 44px
   button. Its dash offset is driven straight from the scroll position
   (see below), so the button doubles as a reading gauge. */
const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Floating round button that appears after the visitor scrolls past the
 * hero and glides back to the top. Rendered only once the threshold is
 * crossed, so keyboard users are not tabbing through a hidden control.
 *
 * A progress ring around the arrow fills with brand color as the page
 * is read (the stroke's dash offset is written inline from the same
 * passive rAF listener that toggles visibility - pure paint, no extra
 * listener, no state churn while scrolling).
 */
export function BackToTop() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setVisible(y > 560);
      const ring = ringRef.current;
      if (ring) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, y / max) : 0;
        /* Units matter: a bare number is valid as an SVG attribute but
           NOT as a CSS value, so the inline write would be ignored. */
        ring.style.strokeDashoffset = `${(RING_C * (1 - p)).toFixed(2)}px`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* When the button first appears the ring must already read the
     current position, not fill in only after the next scroll tick. */
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    ring.style.strokeDashoffset = `${(RING_C * (1 - p)).toFixed(2)}px`;
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 end-6 z-[80]">
      {/* Clearly visible over any patch of fog: brighter glyph at a
          larger optical size, so the control never melts into the
          background. The ring around it shows how far down the page the
          visitor is (see .ring-track / .ring-fill in globals.css). */}
      <Button
        asChild
        size="icon"
        aria-label={t.hud.top}
        className="lg press hud-pop relative size-11 rounded-full text-foreground/85 hover:text-brand"
      >
        <a href="#top">
          <svg
            aria-hidden
            viewBox="0 0 44 44"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle cx="22" cy="22" r={RING_R} fill="none" strokeWidth="2" className="ring-track" />
            <circle
              ref={ringRef}
              cx="22"
              cy="22"
              r={RING_R}
              fill="none"
              strokeWidth="2"
              className="ring-fill"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          <ArrowUp className="relative size-5" aria-hidden />
        </a>
      </Button>
    </div>
  );
}
