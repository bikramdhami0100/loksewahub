"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

function localeFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "ne" ? "ne" : "en";
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(
    () => initialLocale || localeFromPath(pathname)
  );

  useEffect(() => {
    const pathLocale = localeFromPath(pathname);
    if (pathLocale !== locale) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const t = getTranslations(locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
