"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLocale } from "./providers";
import { LangSwitcher } from "./lang-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { t } = useLocale();
  const [active, setActive] = useState("");

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#projects", label: t.nav.projects },
    { href: "#skills", label: t.nav.skills },
    { href: "#contact", label: t.nav.contact },
  ];

  /* Scrollspy: highlights the nav link of the section crossing the middle
     band of the viewport. */
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [t]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      {/* Floating glass capsule. Content scrolls beneath it and the
          living fog shows through the frosted material, the way bars
          behave on iOS. It wears the FULL physics lens (dispersion +
          specular): always on screen, so it is the site's permanent
          showcase of the Liquid Glass material. */}
      <div
        className="entrance lg lens-full relative mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 rounded-full pl-4 pr-2 sm:max-w-3xl sm:pl-5"
        style={{ "--enter-d": "0ms", "--enter-y": "10px" } as React.CSSProperties}
      >
        <a
          href="#top"
          className="press group flex shrink-0 items-center gap-1.5 rounded-full py-1"
          aria-label={`${t.brand}, ${t.hud.top}`}
        >
          <span className="font-display text-[15px] font-bold tracking-tight">
            {t.brand}
          </span>
        </a>

        {/* The layout is deliberate: the section links ride the exact
            center of the capsule (absolutely centered, so they never
            drift when the edge clusters change width), while the brand
            holds the start edge and the language and theme controls
            hold the end edge - pages in the middle, utilities at the
            rim, like an iOS toolbar. */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex"
        >
          {links.map((link) => {
            const isActive = link.href === active;
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "press rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "nav-halo text-brand-strong"
                    : "text-muted-foreground hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={t.nav.menu}
                className="lg press size-9 rounded-full text-muted-foreground hover:text-foreground md:hidden"
              >
                <Menu className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="lg fog-in min-w-44 rounded-[18px] p-1.5"
            >
              {links.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a href={link.href} className="w-full cursor-pointer rounded-[10px] text-sm font-medium">
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
