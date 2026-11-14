"use client";

import { GraduationCap, Layers, Sparkles, Star } from "lucide-react";
import { BlurText } from "@/components/ui/blur-text";
import { tiltGlass, untiltGlass } from "./glass";
import { useLocale } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* One system color per highlight, like rows in iOS Settings, drawn from
   the fog palette: violet, lilac, magenta. */
const HIGHLIGHT_TILES = [
  { Icon: GraduationCap, tile: "tile-wine" },
  { Icon: Layers, tile: "tile-rose" },
  { Icon: Sparkles, tile: "tile-crimson" },
];

export function About() {
  const { t } = useLocale();

  return (
    <section id="about" aria-labelledby="about-title">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          headingId="about-title"
          kicker={t.about.kicker}
          title={t.about.title}
          index={1}
        />

        <div className="grid gap-10 md:grid-cols-[1.55fr_1fr] md:gap-14">
          <div className="space-y-5 text-base leading-relaxed sm:text-lg">
            <p>
              <BlurText text={t.about.p1} delay={26} />
            </p>
            <p className="text-muted-foreground">
              <BlurText text={t.about.p2} delay={26} offset={160} />
            </p>
          </div>

          <Reveal delay={150}>
            <aside
              onMouseMove={tiltGlass}
              onMouseLeave={untiltGlass}
              className="lg tilt press rounded-[24px] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold">
                  <Sparkles className="size-4 text-brand" aria-hidden />
                  {t.about.highlightsTitle}
                </h3>
              </div>
              <ul className="mt-1">
                {t.about.highlights.map((highlight, index) => {
                  const { Icon, tile } = HIGHLIGHT_TILES[index] ?? {
                    Icon: Star,
                    tile: "tile-slate",
                  };
                  return (
                    <li
                      key={highlight}
                      className="group flex items-start gap-3.5 border-b border-border/50 py-4 last:border-b-0 last:pb-0"
                    >
                      <span
                        aria-hidden
                        className={`tile lg ${tile} mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[11px] transition-transform duration-300 ease-out group-hover:scale-105`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <p className="pt-1.5 text-sm leading-relaxed">{highlight}</p>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
