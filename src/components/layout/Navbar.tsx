"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";
import { LocaleLink } from "@/components/shared/LocaleLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "@/providers/locale-provider";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

const publicLinks: NavLink[] = [
  { href: "/notices", labelEn: "Notices", labelNe: "सूचनाहरू" },
  { href: "/syllabus", labelEn: "Syllabus", labelNe: "पाठ्यक्रम" },
  { href: "/notes", labelEn: "Notes", labelNe: "नोट्स" },
  { href: "/old-questions", labelEn: "Old Questions", labelNe: "पुराना प्रश्न" },
  { href: "/current-affairs", labelEn: "Current Affairs", labelNe: "समसामयिक विषय" },
  { href: "/mock-tests", labelEn: "Mock Tests", labelNe: "मोक टेस्ट" },
  { href: "/ai-tutor", labelEn: "AI Tutor", labelNe: "एआई शिक्षक" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const scrolled = useScroll();
  const { data: session } = useSession();
  const { t, locale } = useLocale();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm"
          : "bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <LocaleLink href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Loksewa<span className="text-primary">Hub</span>
            </span>
          </LocaleLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                {locale === "ne" ? link.labelNe : link.labelEn}
              </LocaleLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {session ? (
              <>
                <LocaleLink href="/admin" className="hidden sm:inline-flex">
                  <Button variant="outline" size="sm">Admin</Button>
                </LocaleLink>
                <LocaleLink href="/dashboard">
                  <Avatar src={session.user?.image} name={session.user?.name || ""} size="sm" />
                </LocaleLink>
              </>
            ) : (
              <LocaleLink href="/api/auth/signin">
                <Button size="sm">{t("nav.login")}</Button>
              </LocaleLink>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="px-4 py-4 space-y-1">
            {publicLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {locale === "ne" ? link.labelNe : link.labelEn}
              </LocaleLink>
            ))}
            {session && (
              <>
                <hr className="my-2 border-border" />
                <LocaleLink
                  href="/admin"
                  className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === "ne" ? "प्रशासक" : "Admin"}
                </LocaleLink>
              </>
            )}
            <hr className="my-2 border-border" />
            <LocaleLink
              href="/ai-probable-questions"
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === "ne" ? "एआई सम्भावित प्रश्न" : "AI Probable Questions"}
            </LocaleLink>
            <LocaleLink
              href="/pricing"
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === "ne" ? "मूल्य सूची" : "Pricing"}
            </LocaleLink>
            <LocaleLink
              href="/about"
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === "ne" ? "हाम्रो बारेमा" : "About"}
            </LocaleLink>
            <LocaleLink
              href="/contact"
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === "ne" ? "सम्पर्क" : "Contact"}
            </LocaleLink>
          </div>
        </div>
      )}
    </header>
  );
}
