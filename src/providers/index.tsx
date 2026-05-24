"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "./session-provider";
import { LocaleProvider, type Locale } from "./locale-provider";

export function Providers({
  children,
  locale,
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
