"use client";

import { ArrowDown, BadgeCheck, Server, Smartphone, SquareTerminal } from "lucide-react";
import { BlurText } from "@/components/ui/blur-text";
import { ChannelIcon, channelTile } from "./contact";
import { magnetPull, magnetRelease, tiltGlass, untiltGlass } from "./glass";
import { useLocale } from "./providers";

/* Icon tiles echo iOS Settings rows: glossy gradient squares, one system
   color each, from the site's fog palette (violet, lilac, slate). */
const META_TILES = [
  { Icon: Smartphone, tile: "tile-wine" },
  { Icon: Server, tile: "tile-rose" },
  { Icon: SquareTerminal, tile: "tile-slate" },
];

/* First-impression entrance (see .entrance in globals.css). The wave runs
   once per visit, released by the app loader. Glass panels rise with the
   material already live, wearing a dissipating fog halo; the name is the
   signature: it materializes out of a literal blur while a violet halo
   glow settles into the soft halo that keeps hugging it. The role and
   intro sentences follow through BlurText (word-by-word blur), offset to
   land with the wave. */
const WAVE = {
  badge: { "--enter-d": "50ms", "--enter-y": "4px" },
  name: { "--enter-d": "110ms", "--enter-y": "16px" },
  ctas: { "--enter-d": "380ms", "--enter-y": "8px" },
  socials: { "--enter-d": "440ms", "--enter-y": "6px" },
  stats: { "--enter-d": "500ms", "--enter-y": "12px" },
} as const;

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24"
    >
      {/* A pocket of violet light behind the hero axis (see .hero-glow):
          the name sits in light rather than on bare fog. */}
      <div aria-hidden className="hero-glow" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
        {/* Hero badge: a quiet glass chip. A checked mark stands in for
            the old status dot, and nothing pulses or breathes. */}
        <p
          className="entrance lg inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={WAVE.badge as React.CSSProperties}
        >
          <BadgeCheck className="size-3.5 text-brand" aria-hidden />
          <span className="text-[13px] font-medium text-muted-foreground">
            {t.hero.badge}
          </span>
        </p>

        {/* The hero name: a fluid display size (up to ~5.7rem) with
            tightened Latin tracking, sitting on the aurora - color
            waves travel through the letters and a bright band of light
            crosses them once per cycle (see .name-aurora) - with the
            breathing violet halo behind them. Arabic swaps in roomier
            leading and zero letter-spacing automatically
            (globals.css). */}
        <h1
          className="entrance entrance-fog mt-7 text-balance font-display text-[clamp(2.75rem,8vw,5.7rem)] font-extrabold leading-[1.04] tracking-[-0.035em]"
          style={WAVE.name as React.CSSProperties}
        >
          {/* The halo layer: a blurred violet copy of the name painted
              behind the gradient letters (see .hero-halo). */}
          <span className="relative inline-block">
            <span aria-hidden className="hero-halo">
              {t.name}
            </span>
            <span className="name-aurora">{t.name}</span>
          </span>
        </h1>

        {/* The sub-texts carry quieter echoes of the aurora: the role
            gets a slow bright pass (.text-shimmer), the intro a faint
            violet ink drift (.ink-drift) - one family of light, with
            the name as its source. */}
        <p className="text-shimmer mt-6 text-lg font-medium sm:text-xl">
          <BlurText text={t.hero.role} delay={50} offset={180} />
        </p>

        <p className="ink-drift mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
          <BlurText text={t.hero.intro} delay={30} offset={260} />
        </p>

        <div
          className="entrance mt-9 flex flex-wrap items-center justify-center gap-3.5"
          style={WAVE.ctas as React.CSSProperties}
        >
          {/* Both CTAs are magnetic: they lean toward the pointer while
              hovered (the glossy one also lights up from the point of
              contact, like the glass panels). */}
          <a
            href="#projects"
            onMouseMove={(e) => magnetPull(e, 8)}
            onMouseLeave={magnetRelease}
            className="btn-glossy press group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold"
          >
            <ArrowDown
              className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden
            />
            <span>{t.hero.ctaPrimary}</span>
          </a>
          <a
            href="https://github.com/hammi2"
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={(e) => magnetPull(e, 6)}
            onMouseLeave={magnetRelease}
            className="lg press lift inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-foreground"
          >
            <ChannelIcon icon="github" className="size-4" />
            <span>{t.hero.ctaSecondary}</span>
          </a>
        </div>

        {/* Compact social row. GitHub lives in the secondary CTA, so both
            GitHub channels are filtered out of the icon row; the rest wear
            their true brand colors, like an iOS share sheet. Each tile is
            magnetic: it leans toward the pointer and swells slightly. */}
        <ul
          className="entrance mt-7 flex flex-wrap items-center justify-center gap-2"
          style={WAVE.socials as React.CSSProperties}
        >
          {t.contact.channels
            .filter((channel) => channel.icon !== "github")
            .map((channel) => (
              <li key={channel.href}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${channel.name} (${channel.handle}) - opens in a new tab`}
                  onMouseMove={(e) => magnetPull(e, 5, " scale(1.07)")}
                  onMouseLeave={magnetRelease}
                  className={`tile lg press ${channelTile(channel.icon)} flex size-10 items-center justify-center rounded-full`}
                >
                  <ChannelIcon icon={channel.icon} className="size-4" />
                </a>
              </li>
            ))}
        </ul>

        <dl
          className="entrance mt-14 grid w-full gap-4 sm:grid-cols-3"
          style={WAVE.stats as React.CSSProperties}
        >
          {t.hero.meta.map((item, index) => {
            const { Icon, tile } = META_TILES[index] ?? META_TILES[0];
            return (
              <div
                key={item.k}
                onMouseMove={tiltGlass}
                onMouseLeave={untiltGlass}
              className="lg tilt press lift rounded-[24px] px-5 py-5 text-start"
            >
              <dt className="flex items-center gap-3 text-[13px] font-medium text-muted-foreground">
                <span
                  aria-hidden
                  className={`tile lg ${tile} flex size-9 shrink-0 items-center justify-center rounded-[11px]`}
                >
                  <Icon className="size-4" />
                </span>
                {item.k}
              </dt>
              <dd className="tnum mt-3 text-lg font-semibold">{item.v}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
