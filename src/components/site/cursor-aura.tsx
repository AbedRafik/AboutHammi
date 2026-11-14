"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor aura: the page's answer to the pointer. A soft violet light,
 * sized like a room lamp, trails the cursor everywhere with a dreamy
 * lerped follow. It sits above the fog scene but below every piece of
 * content, so it never washes out text: instead it glows through the
 * frosted glass panels, which blur and refract it like any other part
 * of the backdrop.
 *
 * Pointer devices only (hover + fine pointer), never under reduced
 * motion, and it fades in on the first move rather than popping at the
 * page corner. Purely decorative: aria-hidden, pointer-transparent,
 * and nothing depends on it.
 */
export function CursorAura() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let shown = false;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!shown) {
        shown = true;
        x = targetX;
        y = targetY;
        el.classList.add("is-on");
      }
    };

    /* documentleave hides it so the light does not linger at the edge. */
    const onLeave = () => el.classList.remove("is-on");
    const onEnter = () => shown && el.classList.add("is-on");

    const tick = () => {
      /* Lerp: a lazy 9% chase, so the light floats behind the cursor. */
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={ref} aria-hidden className="cursor-aura" />;
}
