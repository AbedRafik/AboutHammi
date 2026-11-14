"use client";

import { ArrowUpRight, CodeXml, Play } from "lucide-react";
import fastyIcon from "@/assets/fasty-icon.png";
import { BlurText } from "@/components/ui/blur-text";
import { tiltGlass, untiltGlass } from "./glass";
import { useLocale } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* Letter tiles stand in for app icons: one glossy fog color per
   project, rotating through violet, pink, slate, lilac, magenta. */
const PROJECT_TILES = ["tile-wine", "tile-blush", "tile-slate", "tile-rose", "tile-crimson"];

export function Projects() {
  const { t } = useLocale();

  /* The Google Play app leads as a featured card; everything else stays
     in the list. Selection is by store type, never by name, so the layout
     follows the data. */
  const featured = t.projects.items.find((project) => project.store === "play");
  const rest = t.projects.items.filter((project) => project !== featured);

  return (
    <section id="projects" aria-labelledby="projects-title">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          headingId="projects-title"
          kicker={t.projects.kicker}
          title={t.projects.title}
          sub={t.projects.sub}
          index={2}
        />

        {featured ? (
          <Reveal className="mb-4">
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={tiltGlass}
              onMouseLeave={untiltGlass}
              className="lg tilt press lift group relative block overflow-hidden rounded-[32px] p-6 sm:p-8"
            >
              {/* A quiet pink wash over the store corner: the Play
                  badge's color as light, not as another layer. It is a
                  decorative child (never the glass itself), so the
                  card's material stays untouched. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -end-16 -top-20 size-64 rounded-full bg-pink-soft/35 blur-3xl dark:bg-pink-soft/20"
              />
              <div className="relative flex items-start justify-between gap-6">
                {/* The app's real icon, App Store style: a soft-cornered
                    square (the iOS squircle ratio) leading the card, in
                    a hairline frame with a resting shadow. It swells
                    a touch on hover, like a tile waking up. */}
                <img
                  src={fastyIcon.src}
                  alt=""
                  className="hidden size-20 shrink-0 rounded-[22px] object-cover shadow-[0_18px_36px_-16px_rgb(0_0_0/0.4)] ring-1 ring-black/10 transition-transform duration-300 ease-out group-hover:scale-[1.04] sm:block dark:ring-white/15"
                />

                <div className="min-w-0 flex-1">
                  <span className="soft-tint soft-tint-pink inline-flex items-center gap-1.5 rounded-full bg-pink-soft px-2.5 py-1 text-[11px] font-semibold text-pink">
                    <Play className="size-3 fill-current" aria-hidden />
                    {t.projects.storePlay}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    <BlurText text={featured.name} delay={80} offset={140} />
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    <BlurText text={featured.desc} delay={20} offset={240} />
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {featured.tags}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="soft-tint soft-tint-neutral flex size-12 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-muted-foreground transition-all duration-300 group-hover:bg-pink group-hover:text-white group-hover:shadow-[0_10px_24px_-8px_rgb(255_45_85_/_0.45)] sm:flex rtl:group-hover:-translate-x-1"
                >
                  <ArrowUpRight className="size-5 rtl:-scale-x-100" />
                </span>
              </div>
            </a>
          </Reveal>
        ) : null}

        <Reveal>
          <ul className="lg rounded-[28px] p-2 sm:p-3">
            {rest.map((project, index) => (
              <li key={project.name}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={tiltGlass}
                  onMouseLeave={untiltGlass}
                  className="row-spot tilt press group flex items-center gap-4 rounded-[20px] px-4 py-5 transition-colors duration-200 hover:bg-brand-soft/60 sm:gap-6 sm:px-5"
                >
                  <span
                    aria-hidden
                    className={`tile lg ${PROJECT_TILES[index % PROJECT_TILES.length]} hidden size-12 shrink-0 items-center justify-center rounded-[14px] font-display text-xl font-bold sm:flex`}
                  >
                    {project.name.charAt(0)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                        {project.name}
                      </span>
                      {project.store === "play" ? (
                        <span className="soft-tint soft-tint-pink inline-flex items-center gap-1.5 rounded-full bg-pink-soft px-2.5 py-1 text-[11px] font-semibold text-pink">
                          <Play className="size-3 fill-current" aria-hidden />
                          {t.projects.storePlay}
                        </span>
                      ) : (
                        <span className="soft-tint inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                          <CodeXml className="size-3" aria-hidden />
                          {t.projects.storeCode}
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {project.desc}
                    </span>
                    <span className="mt-1.5 block text-sm text-muted-foreground">
                      {project.tags}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="soft-tint soft-tint-neutral flex size-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_10px_24px_-8px_var(--glow-brand)] rtl:group-hover:-translate-x-0.5"
                  >
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
