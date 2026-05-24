"use client";

import { useLocale } from "@/providers/locale-provider";
import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ne" : "en";
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "ne") {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    setLocale(newLocale);
    router.push(`/${segments.join("/")}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="gap-1.5"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">
        {locale === "en" ? "नेपाली" : "English"}
      </span>
    </Button>
  );
}
