"use client";

import { useEffect, useRef } from "react";

/**
 * A measurement curve trace in the well log world. The path is always
 * rendered for no-JS visitors; when JS runs and motion is welcome, the
 * trace draws itself once as it enters the viewport.
 */
export function CurveTrace({
  variant = 0,
  className = "",
  dashed = false,
  width = 44,
  height = 220,
}: {
  variant?: number;
  className?: string;
  dashed?: boolean;
  width?: number;
  height?: number;
}) {
  const rootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const path = el.querySelector<SVGPathElement>("path.trace");
    if (!path) return;

    const len = path.getTotalLength();
    path.style.setProperty("--len", String(Math.ceil(len)));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("drawn");
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    el.classList.add("draws");
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Deterministic wiggle: a plotted pen trace, no randomness per render
  const v = variant % 4;
  const mid = width / 2;
  const amp = width * 0.34;
  const stops: Array<[number, number]> = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = (t * height).toFixed(1);
    const wobble =
      Math.sin(t * Math.PI * (2.2 + v * 0.8) + v * 1.7) * amp * (0.55 + 0.45 * Math.sin(t * Math.PI));
    const drift = v % 2 === 0 ? Math.sin(t * Math.PI) * (width * 0.1) : -Math.sin(t * Math.PI) * (width * 0.08);
    const x = Math.max(2, Math.min(width - 2, mid + wobble + drift));
    stops.push([Number(x.toFixed(1)), Number(y)]);
  }
  const d = stops.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

  return (
    <svg
      ref={rootRef}
      className={`curve ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="trace"
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={dashed ? 1.4 : 2}
        strokeDasharray={dashed ? "5 4" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
