"use client";

import { useState } from "react";

import { localeMeta, locales } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "./providers";

/**
 * Compact segmented switcher in a rounded pill. The native name of each
 * language is kept in its own script so the choice is readable regardless
 * of the active locale. Switching replaces essentially all page text and
 * flips direction, so a polite live region announces the change: screen
 * readers otherwise get no signal that the language moved under them.
 */
export function LangSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [announced, setAnnounced] = useState("");

  return (
    <div
      role="group"
      aria-label={t.actions.language}
      className={cn(
        "lg flex items-center gap-0.5 rounded-full p-0.5",
        className,
      )}
    >
      <span aria-live="polite" className="sr-only">
        {announced}
      </span>
      {locales.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLocale(l);
              setAnnounced(localeMeta[l].long);
            }}
            aria-pressed={active}
            title={localeMeta[l].long}
            className={cn(
              "press rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all",
              active
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {localeMeta[l].label}
          </button>
        );
      })}
    </div>
  );
}
