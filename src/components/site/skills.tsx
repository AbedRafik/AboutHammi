"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CodeXml, Server, Smartphone, Wrench } from "lucide-react";
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/ui/marquee";
import { trackGlassPointer } from "./glass";
import { useLocale } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      /* Safari 13 / iOS 13 predate MediaQueryList.addEventListener;
         without the fallback the subscribe call throws during commit
         and takes the whole page down on those browsers. */
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
      }
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* One system color per group, like rows in iOS Settings, drawn from
   the fog palette: violet, lilac, magenta, pink. */
const GROUP_TILES = [
  { Icon: Smartphone, tile: "tile-wine" },
  { Icon: Server, tile: "tile-rose" },
  { Icon: Wrench, tile: "tile-crimson" },
  { Icon: CodeXml, tile: "tile-blush" },
];

/**
 * Full-bleed tech ticker on a frosted glass shelf (see .skills-rail in
 * globals.css): the band itself is the ONE Liquid Glass panel, so the
 * living fog blurs through it in both appearances, while the labels on
 * it stay plain text (per-chip glass was both the "small cards inside
 * a big card" look and the source of the marquee lag - a moving row of
 * backdrop filters re-rasters every frame). The strip is decorative,
 * so it is hidden from assistive technology. It always runs
 * left-to-right (dir="ltr") because react-fast-marquee positions its
 * clones with LTR math; inside an RTL page its own RTL mode empties
 * the band. Chips are mostly Latin tech names, and Arabic labels still
 * shape correctly in an LTR flex row. It pauses on hover and stops
 * entirely under reduced motion.
 */
function SkillsMarquee({ items }: { items: string[] }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" dir="ltr" className="skills-rail lg">
      {/* The edges fade through a mask on the band itself rather than
          overlay gradients, so the backdrop artwork stays visible under
          the strip (see .marquee-mask in globals.css). */}
      <Marquee className="marquee-mask">
        <MarqueeContent speed={38} play={!reduced}>
          {items.map((item, index) => (
            <MarqueeItem
              key={`${item}-${index}`}
              className="flex items-center"
            >
              {/* Plain text labels on the glass shelf: NO per-chip glass.
                  A backdrop-filter on every chip re-rasters all of them
                  on every animation frame of the moving strip over the
                  living fog (the marquee lag), while the shelf behind
                  them already provides the frosted glass. --chip-i still
                  drives the staggered chip-in ripple. */}
              <span
                className="skills-chip inline-flex items-center whitespace-nowrap"
                style={{ "--chip-i": index % 12 } as React.CSSProperties}
              >
                {item}
              </span>
              {/* The dot is a SEPARATOR, not a bullet: it sits centered
                  between this label and the next one, so the band reads
                  as one continuous "name . name . name" ribbon. */}
              <span
                aria-hidden
                className="mx-5 size-1.5 shrink-0 rounded-full bg-brand/70"
              />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}

export function Skills() {
  const { t } = useLocale();
  const items = Array.from(new Set(t.skills.groups.flatMap((group) => group.items)));

  return (
    <section id="skills" aria-labelledby="skills-title">
      <div className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          headingId="skills-title"
          kicker={t.skills.kicker}
          title={t.skills.title}
          sub={t.skills.sub}
          index={3}
        />
      </div>

      {/* The strip sits in a Reveal (as a flat shelf: full-bleed bands
          skew oddly under a 3D tilt) so the glass rail materializes
          with the dissipating fog like every other glass surface, the
          labels rippling in one by one. */}
      <Reveal className="reveal-shelf">
        <SkillsMarquee items={items} />
      </Reveal>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:pt-16 sm:pb-24">
        <Reveal>
          <ul className="lg rounded-[28px] px-2 py-2 sm:px-3">
            {t.skills.groups.map((group, index) => {
              const { Icon, tile } = GROUP_TILES[index % GROUP_TILES.length];
              return (
                <li
                  key={group.title}
                  onMouseMove={trackGlassPointer}
                  className="row-spot rounded-[20px] p-5 transition-colors duration-200 hover:bg-brand-soft/50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                    <h3 className="flex items-center gap-3 text-[15px] font-semibold sm:w-60 sm:shrink-0">
                      <span
                        aria-hidden
                        className={`tile lg ${tile} flex size-9 shrink-0 items-center justify-center rounded-[11px]`}
                      >
                        <Icon className="size-4" />
                      </span>
                      {group.title}
                    </h3>
                    {/* Tool chips: each one lifts slightly on hover. */}
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="soft-tint soft-tint-neutral cursor-default rounded-full bg-black/[0.04] px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-soft hover:text-brand dark:bg-white/[0.07]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
