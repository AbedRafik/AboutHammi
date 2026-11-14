"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  defaultLocale,
  dictionaryFor,
  dirFor,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/* The locale lives on document.documentElement as the single source of
   truth. The bootstrap script in the document head sets it before first
   paint from storage or the browser language, and it is read here as an
   external store, so no state is duplicated inside React. */
let listeners: Array<() => void> = [];

function subscribeLocale(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
}

function getLocaleSnapshot(): Locale {
  const current = document.documentElement.lang;
  return isLocale(current) ? current : defaultLocale;
}

function getServerLocaleSnapshot(): Locale {
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getServerLocaleSnapshot);

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* storage unavailable, the choice lives for this visit only */
    }
    document.documentElement.lang = next;
    document.documentElement.dir = dirFor(next);
    for (const listener of listeners) {
      listener();
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: dirFor(locale),
      t: dictionaryFor(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return ctx;
}
