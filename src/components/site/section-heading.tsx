"use client";

import { BlurText } from "@/components/ui/blur-text";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  headingId: string;
  kicker: string;
  title: string;
  sub?: string;
  /** Editorial section index (1-based), rendered as a tabular 01/02... */
  index?: number;
};

/** Shared section opener in the Apple mold: a small violet eyebrow
 *  (hairline ticks, an optional tabular index), then a large bold title
 *  on a fluid clamp scale, then an optional lead sentence. Everything
 *  shares the page's single centered axis for one tidy rhythm. The
 *  title and lead materialize word by word out of a blur (BlurText),
 *  staggered behind the block's rise. */
export function SectionHeading({ headingId, kicker, title, sub, index }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 text-center sm:mb-14">
      <p className="kicker">
        {index ? (
          <span className="tnum opacity-60">{String(index).padStart(2, "0")}</span>
        ) : null}
        {kicker}
      </p>
      <h2
        id={headingId}
        className="mt-4 text-balance font-display text-[clamp(2.1rem,4.6vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.022em]"
      >
        <BlurText text={title} delay={70} />
      </h2>
      {sub ? (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          <BlurText text={sub} delay={26} />
        </p>
      ) : null}
    </Reveal>
  );
}
