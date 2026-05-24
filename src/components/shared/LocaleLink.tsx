"use client";

import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import { useLocale } from "@/providers/locale-provider";
import type { ReactNode } from "react";

const NO_PREFIX = [/^https?:\/\//, /^mailto:/, /^tel:/, /^#/];

export function LocaleLink({
  href,
  children,
  ...props
}: NextLinkProps & { children: ReactNode }) {
  const { locale } = useLocale();

  const resolvedHref =
    typeof href === "string" &&
    !NO_PREFIX.some((p) => p.test(href)) &&
    href !== "/" &&
    !href.startsWith("/api/") &&
    !href.startsWith("/auth/")
      ? `/${locale}${href}`
      : href;

  return (
    <NextLink href={resolvedHref} {...props}>
      {children}
    </NextLink>
  );
}
