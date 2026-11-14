"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "./providers";

/* Konami sequence: Up Up Down Down Left Right Left Right B A. */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/* An 8-bit cup drawn on an 8x8 grid (one rect per "pixel"), so the
   achievement livery stays pixel-art instead of a smooth icon.
   crispEdges keeps every pixel razor sharp at any size. */
function PixelTrophy({ className }: { className?: string }) {
  const pixels: Array<[number, number, number]> = [
    // rim
    [1, 0, 6],
    // handles + cup walls
    [0, 1, 8],
    [0, 2, 1],
    [2, 2, 4],
    [7, 2, 1],
    [0, 3, 1],
    [2, 3, 4],
    [7, 3, 1],
    // taper
    [2, 4, 4],
    // stem
    [3, 5, 2],
    // base
    [2, 6, 4],
    [1, 7, 6],
  ];
  return (
    <svg
      viewBox="0 0 8 8"
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {pixels.map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={1} />
      ))}
    </svg>
  );
}

const PIXEL_COLORS = ["var(--brand)", "var(--gold)", "var(--rare)"];

type Pixel = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
};

/**
 * Game easter egg: entering the Konami code anywhere on the page unlocks
 * an achievement toast and a brief rain of reward pixels. Purely
 * decorative; screen readers get the toast through an aria-live region,
 * and the pixel rain is skipped entirely under reduced motion.
 */
export function Konami() {
  const { t } = useLocale();
  const [toast, setToast] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const progress = useRef(0);
  const timers = useRef<number[]>([]);

  const fire = useCallback(() => {
    setToast(true);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPixels(
        Array.from({ length: 42 }, (_, i) => ({
          id: Date.now() + i,
          left: Math.random() * 100,
          duration: 1400 + Math.random() * 1600,
          delay: Math.random() * 700,
          color: PIXEL_COLORS[i % PIXEL_COLORS.length],
          size: 6 + Math.round(Math.random() * 3) * 3,
        })),
      );
    }

    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    timers.current.push(
      window.setTimeout(() => setToast(false), 4200),
      window.setTimeout(() => setPixels([]), 4200),
    );
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key =
        event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === KONAMI[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          fire();
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, [fire]);

  return (
    <>
      {pixels.map((pixel) => (
        <span
          key={pixel.id}
          aria-hidden
          className="reward-pixel"
          style={{
            left: `${pixel.left}vw`,
            width: pixel.size,
            height: pixel.size,
            backgroundColor: pixel.color,
            animationDuration: `${pixel.duration}ms`,
            animationDelay: `${pixel.delay}ms`,
          }}
        />
      ))}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4">
        {toast ? (
          <div className="ach-toast pixel-card flex items-center gap-3 px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center border-2 border-gold bg-gold-soft text-gold">
              <PixelTrophy className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-pixel text-[9px] leading-relaxed text-gold">
                {t.toast.title}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {t.toast.text}
              </span>
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
}
