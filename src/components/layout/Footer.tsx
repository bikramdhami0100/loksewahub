"use client";

import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/shared/LocaleLink";

const quickLinks = [
  { href: "/notices", labelEn: "Notices", labelNe: "सूचनाहरू" },
  { href: "/syllabus", labelEn: "Syllabus", labelNe: "पाठ्यक्रम" },
  { href: "/notes", labelEn: "Notes", labelNe: "नोट्स" },
  { href: "/current-affairs", labelEn: "Current Affairs", labelNe: "समसामयिक विषय" },
  { href: "/mock-tests", labelEn: "Mock Tests", labelNe: "मोक टेस्ट" },
  { href: "/old-questions", labelEn: "Old Questions", labelNe: "पुराना प्रश्न" },
];

const resources = [
  { href: "/ai-tutor", labelEn: "AI Tutor", labelNe: "एआई शिक्षक" },
  { href: "/ai-probable-questions", labelEn: "AI Predictions", labelNe: "एआई भविष्यवाणी" },
  { href: "/faq", labelEn: "FAQ", labelNe: "सोधिने प्रश्नहरू" },
  { href: "/pricing", labelEn: "Pricing", labelNe: "मूल्य सूची" },
];

const company = [
  { href: "/about", labelEn: "About Us", labelNe: "हाम्रो बारेमा" },
  { href: "/contact", labelEn: "Contact", labelNe: "सम्पर्क" },
  { href: "/privacy", labelEn: "Privacy Policy", labelNe: "गोपनीयता नीति" },
  { href: "/terms", labelEn: "Terms of Service", labelNe: "सेवाका सर्तहरू" },
];

export function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <LocaleLink href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Loksewa<span className="text-primary">Hub</span>
              </span>
            </LocaleLink>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@loksewahub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {locale === "ne" ? link.labelNe : link.labelEn}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {locale === "ne" ? link.labelNe : link.labelEn}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link.href}>
                  <LocaleLink
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {locale === "ne" ? link.labelNe : link.labelEn}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} LoksewaHub. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
