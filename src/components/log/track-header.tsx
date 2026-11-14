"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

/**
 * The track header strip: navigation set into the log as track selectors.
 */
export function TrackHeader() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mark = window.scrollY + window.innerHeight * 0.32;
        let current = "";
        for (const l of LINKS) {
          const el = document.querySelector(l.href);
          if (el && (el as HTMLElement).offsetTop <= mark) current = l.href;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95">
      <div className="mx-auto flex h-14 max-w-6xl items-stretch justify-between pl-4 pr-3 sm:pl-6 lg:pl-10">
        <a
          href="#main"
          className="hidden items-center font-display text-base font-semibold uppercase tracking-[0.08em] text-ink sm:flex"
        >
          Hammi Abou Houraira
        </a>
        <nav aria-label="Sections" className="flex flex-1 items-stretch justify-end sm:flex-none">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
              className={`flex items-center px-1.5 font-data text-[10.5px] tracking-[0.08em] uppercase transition-colors sm:px-3.5 sm:text-[12px] sm:tracking-[0.14em] ${
                active === l.href
                  ? "text-pen"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <span className="relative py-1">
                {l.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[3px] bg-pen transition-opacity ${
                    active === l.href ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            </a>
          ))}
          <a
            href="#contact"
            className="my-2.5 ml-1 flex items-center whitespace-nowrap bg-pen px-2.5 font-data text-[10.5px] font-medium tracking-[0.04em] text-paper uppercase transition-colors hover:bg-pen-deep sm:my-2 sm:px-4 sm:text-[12px] sm:tracking-[0.14em]"
          >
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}
