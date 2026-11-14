"use client";

import { useEffect, useRef, Fragment } from "react";

/**
 * BlurText: the text-appearance animation. Words materialize out of a
 * blur with a short rise, staggered through the text (the inline order
 * follows the writing direction, so Arabic staggers right to left).
 *
 * Zero animation dependencies: the stagger is a CSS animation on each
 * word (.blur-word in globals.css) driven by a --word-d custom
 * property, the same technique as the loader letters. Words are plain
 * inline-blocks joined by real spaces, so wrapping and text-balance
 * keep working, and screen readers read the sentence, not the spans.
 * Bidi: inline-blocks are atomic for the paragraph's reordering, so in
 * Arabic sentences consecutive Latin words are merged into one unit
 * (see the guard below) to keep phrases like Google Play from reading
 * reversed.
 *
 * Arming rules (mirroring the site's .entrance safety model):
 * - words stay hidden from arm time until the component arms them, so a
 *   heading can never flash as settled text before blurring in: the
 *   first thing the eye meets IS the blur-in;
 * - armed on first visibility (threshold 0: the moment the first pixel
 *   crosses the viewport edge) AND after the loader departs, so the
 *   hero's words land with the entrance wave;
 * - reduced-motion visitors get plain text instantly;
 * - without JS, or if hydration dies (the boot script then marks
 *   html[data-no-hydration] at its 5s force release), the words are
 *   simply visible;
 * - switching language swaps every word, which replays the blur once
 *   for the new copy.
 */
export function BlurText({
  text,
  className,
  delay = 55,
  offset = 0,
}: {
  text: string;
  className?: string;
  /** Stagger between words, in ms. */
  delay?: number;
  /** Base delay before the first word, in ms (to align with the hero's
   *  entrance wave or a sibling element). */
  offset?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-in", "");
      return;
    }
    let inView = false;
    let started = false;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const maybeStart = () => {
      const ready = document.documentElement.hasAttribute("data-app-ready");
      if (!started && inView && ready) {
        started = true;
        el.setAttribute("data-in", "");
        io?.disconnect();
        mo?.disconnect();
      }
    };
    /* Threshold 0: arm the blur before the words are truly readable,
       so the stagger plays as the heading enters instead of after a
       glimpse of settled text. */
    io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        maybeStart();
      },
      { threshold: 0 },
    );
    io.observe(el);
    mo = new MutationObserver(maybeStart);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-app-ready"],
    });
    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, [text]);

  /* Bidi guard: in Arabic (RTL) sentences, consecutive Latin words
     (React Native, Google Play, REST API) must share ONE inline-block.
     Separate atomic boxes would be ordered right-to-left by the RTL
     paragraph and the phrase would read reversed (Play Google). A
     token joins the previous unit only when BOTH lead with a Latin
     letter or digit, so mixed Arabic-Latin tokens (وDjango) stay
     independent and pure-English sentences keep the per-word
     stagger. */
  const rtl = /[\u0600-\u06FF]/.test(text);
  const latinLead = (s: string) => /^[A-Za-z0-9]/.test(s);
  const units: string[] = [];
  for (const word of text.split(" ")) {
    if (
      rtl &&
      units.length > 0 &&
      latinLead(word) &&
      latinLead(units[units.length - 1])
    ) {
      units[units.length - 1] += ` ${word}`;
    } else {
      units.push(word);
    }
  }

  return (
    <span ref={ref} className={`blur-text ${className ?? ""}`.trim()}>
      {units.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="blur-word">{word}</span>
          {/* A real space text node between the inline-block words; a
              trailing space inside a word span would collapse. */}
          {i < units.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
