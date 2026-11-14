"use client";

import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "./icons";
import { BlurText } from "@/components/ui/blur-text";
import { DiscordIcon } from "./icons";
import { magnetPull, magnetRelease, tiltGlass, untiltGlass } from "./glass";
import { useLocale } from "./providers";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * Maps the explicit channel icon key to its mark. Both GitHub accounts are
 * listed (the primary account first). Exported so the hero can render the
 * same marks on its social row.
 */
export function ChannelIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "github":
      return <GithubIcon className={className} aria-hidden />;
    case "linkedin":
      return <LinkedinIcon className={className} aria-hidden />;
    case "instagram":
      return <InstagramIcon className={className} aria-hidden />;
    case "facebook":
      return <FacebookIcon className={className} aria-hidden />;
    default:
      return <DiscordIcon className={className} />;
  }
}

/* Each social channel wears its TRUE brand color: GitHub near-black,
   LinkedIn blue, the Instagram gradient, Facebook blue, Discord blurple.
   Recognizable marks belong in their own livery. */
const CHANNEL_TILES: Record<string, string> = {
  github: "tile-github",
  linkedin: "tile-linkedin",
  instagram: "tile-instagram",
  facebook: "tile-facebook",
  discord: "tile-discord",
};

/** Resolves a channel icon key to its brand tile class. Exported so the
 *  hero's compact social row wears the same correct brand colors. */
export function channelTile(icon: string): string {
  return CHANNEL_TILES[icon] ?? "tile-slate";
}

export function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          headingId="contact-title"
          kicker={t.contact.kicker}
          title={t.contact.title}
          index={4}
        />

        <Reveal>
          <div
            onMouseMove={tiltGlass}
            onMouseLeave={untiltGlass}
            className="lg tilt press relative rounded-[28px] p-6 text-center sm:p-8"
          >
            <div className="relative mx-auto max-w-xl">
              <h3 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                <BlurText text={t.contact.heading} delay={60} />
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <BlurText text={t.contact.text} delay={24} offset={180} />
              </p>
              <div className="mt-8">
                <a
                  href="https://www.linkedin.com/in/abou-horaira-75bb93377"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={(e) => magnetPull(e, 8)}
                  onMouseLeave={magnetRelease}
                  className="btn-glossy press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold"
                >
                  <LinkedinIcon className="size-4" aria-hidden />
                  <span>{t.contact.cta}</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* Channels lead: bracketed by short fading hairlines (the
              kicker's vocabulary, one size down) instead of a leading
              dot; symmetric in both directions, so RTL mirrors cleanly. */}
          <p className="mb-5 mt-14 flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span aria-hidden className="channels-tick" />
            {t.contact.channelsTitle}
            <span aria-hidden className="channels-tick channels-tick-end" />
          </p>
          {/* NO dim-siblings here: the dim works through opacity, and an
              opacity below 1 on a .lg card switches its frosted
              backdrop-filter off and on mid-transition - exactly the
              "blur disappears then comes back" flicker. The cards' own
              glass must stay untouched by every interaction. */}
          <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {t.contact.channels.map((channel, index) => (
              <li key={`${channel.href}-${index}`}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={tiltGlass}
                  onMouseLeave={untiltGlass}
                  className="lg tilt press lift group flex items-center gap-3.5 rounded-[20px] px-5 py-4"
                >
                  <span
                    aria-hidden
                    className={`tile lg ${channelTile(channel.icon)} flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-transform duration-300 group-hover:scale-105`}
                  >
                    <ChannelIcon icon={channel.icon} className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {channel.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                      {channel.handle}
                    </span>
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
