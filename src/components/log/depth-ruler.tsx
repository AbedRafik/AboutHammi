"use client";

import { useEffect, useRef } from "react";

/**
 * The depth rail: a printed meter scale down the left edge whose live
 * reader follows the scroll, and a thin progress edge on small screens.
 * The reader measures the depth at the same viewport mark the track
 * header's scrollspy uses, so its reading agrees with the printed
 * interval depths.
 */
export function DepthRuler({ totalDepth = 800 }: { totalDepth?: number }) {
  const chipRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const pageHeight = doc.scrollHeight;
      const mark = window.scrollY + window.innerHeight * 0.32;
      const p = Math.min(1, Math.max(0, mark / pageHeight));
      const depth = Math.round(p * totalDepth);
      const chip = chipRef.current;
      if (chip) {
        const rail = chip.parentElement;
        if (rail) {
          const y = p * (rail.clientHeight - chip.offsetHeight);
          chip.style.transform = `translateY(${Math.max(0, y)}px)`;
        }
        const label = chip.querySelector("[data-depth]");
        if (label) label.textContent = `${depth} m`;
      }
      const fill = fillRef.current;
      if (fill) {
        const sp =
          doc.scrollHeight - window.innerHeight > 0
            ? Math.min(
                1,
                Math.max(
                  0,
                  window.scrollY / (doc.scrollHeight - window.innerHeight)
                )
              )
            : 0;
        fill.style.height = `${sp * 100}%`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [totalDepth]);

  return (
    <>
      {/* Printed rail, large screens. It starts below the sticky track
          header so nothing it prints is ever occluded. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 top-14 z-30 hidden w-16 xl:block"
      >
        <div className="absolute inset-y-0 right-0 border-r border-rule" />
        <div className="absolute inset-y-0 right-[13px] w-px bg-rule" />
        <div className="absolute inset-y-0 right-0 w-3.5 [background:repeating-linear-gradient(to_bottom,var(--rule)_0,var(--rule)_1px,transparent_1px,transparent_26px)]" />
        <span className="absolute right-4 top-7 rotate-90 font-data text-[10px] tracking-[0.22em] text-ink-soft">
          SURFACE
        </span>
        <span className="absolute bottom-7 right-4 rotate-90 font-data text-[10px] tracking-[0.22em] text-ink-soft">
          TD {totalDepth} m
        </span>
        <div className="absolute inset-y-4 right-1 w-12">
          <div
            ref={chipRef}
            className="absolute left-0 top-0 rounded-none bg-ink px-1.5 py-0.5 font-data text-[10px] font-medium tracking-wide text-paper shadow-none"
          >
            <span data-depth>0 m</span>
          </div>
        </div>
      </div>

      {/* Progress edge, small screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-0 z-30 w-[3px] bg-rule/60 xl:hidden"
      >
        <div ref={fillRef} className="w-full bg-pen" style={{ height: "0%" }} />
      </div>
    </>
  );
}
