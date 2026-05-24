"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

const faqIds = Array.from({ length: 8 }, (_, i) => i + 1);

export default function FaqPage() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const filtered = faqIds.filter((id) => {
    const q = t(`faq.q${id}`).toLowerCase();
    const a = t(`faq.a${id}`).toLowerCase();
    const s = search.toLowerCase();
    return q.includes(s) || a.includes(s);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("faq.title")} subtitle={t("faq.subtitle")} />
      </div>

      <div ref={contentRef} className="mx-auto max-w-3xl space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t("common.search")} ${t("faq.title").toLowerCase()}...`}
            className="pl-9"
          />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <HelpCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t("common.noData")}</p>
            </div>
          ) : (
            filtered.map((id) => {
              const isOpen = openId === id;
              return (
                <Card
                  key={id}
                  className={cn(
                    "overflow-hidden transition-shadow hover:shadow-md cursor-pointer",
                    isOpen && "border-primary/30"
                  )}
                  onClick={() => setOpenId(isOpen ? null : id)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between p-5">
                      <h3 className="font-medium pr-8 text-sm sm:text-base leading-relaxed">
                        {t(`faq.q${id}`)}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                          {t(`faq.a${id}`)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
