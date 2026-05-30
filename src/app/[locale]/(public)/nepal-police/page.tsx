"use client";

import { useState, useEffect } from "react";
import { Bell, ExternalLink, Calendar, Loader2, FileText, X, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface PoliceItem {
  id: number;
  url: string;
  web_url: string;
  title: string | null;
  description: string;
  title_np: string;
  description_np: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

const tabs = [
  { id: "notices", label: { en: "Notices", ne: "सूचना" }, icon: Bell },
  { id: "news", label: { en: "News", ne: "समाचार" }, icon: FileText },
] as const;

export default function NepalPolicePage() {
  const { locale } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const [activeTab, setActiveTab] = useState<"notices" | "news">("notices");
  const [items, setItems] = useState<PoliceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PoliceItem | null>(null);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    setSelectedItem(null);
    const endpoint = activeTab === "notices" ? "notices" : "news";
    fetch(`/api/nepal-police/${endpoint}?limit=${limit}&offset=${offset}`)
      .then((r) => r.json())
      .then((d) => {
        const result: PoliceItem[] = d?.results || [];
        setItems(result);
        setHasMore(result.length >= limit);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, offset]);

  const getTitle = (item: PoliceItem) => {
    if (item.title_np) return item.title_np;
    if (item.title) return item.title;
    return "";
  };

  const getDescription = (item: PoliceItem) => {
    if (activeTab === "news") {
      if (item.description_np) return item.description_np;
      return item.description || "";
    }
    if (item.description_np) return stripHtml(item.description_np).substring(0, 200);
    if (item.description) return stripHtml(item.description).substring(0, 200);
    return "";
  };

  return (
    <div className="flex flex-col">
      <section ref={headerRef} className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4"><Shield className="mr-1 h-3.5 w-3.5" />Nepal Police</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {locale === "ne" ? "नेपाल प्रहरी" : "Nepal Police"}
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            {locale === "ne" ? "लाइभ डाटा नेपाल प्रहरीबाट सिधा" : "Live data fetched directly from nepalpolice.gov.np"}
          </p>
        </div>
      </section>

      <section ref={contentRef} className="border-t bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-1 mb-8 border-b overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOffset(0); }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                    isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {locale === "ne" ? tab.label.ne : tab.label.en}
                </button>
              );
            })}
          </div>

          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-4 sm:py-8">
              <div className="relative w-full max-w-3xl mx-2 sm:mx-4 rounded-xl border bg-card shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b bg-card px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl z-10">
                  <h2 className="text-sm sm:text-lg font-semibold truncate pr-4">
                    {locale === "ne" ? "विवरण" : "Details"}
                  </h2>
                  <button onClick={() => setSelectedItem(null)} className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors">
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
                  <div>
                    <h3 className="text-base font-medium leading-relaxed">{getTitle(selectedItem)}</h3>
                  </div>

                  {(selectedItem.description_np || selectedItem.description) && (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{
                        __html: activeTab === "news" ? (selectedItem.content_np || selectedItem.description_np || "") : selectedItem.description_np || selectedItem.description || ""
                      }} />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                      {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
                    </Button>
                    {selectedItem.web_url && (
                      <a href={selectedItem.web_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-3.5 w-3.5" />{locale === "ne" ? "पूरा हेर्नुहोस्" : "View Full"}</Button>
                      </a>
                    )}
                    <a href="https://www.nepalpolice.gov.np" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-3.5 w-3.5" />nepalpolice.gov.np</Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-20">
              {locale === "ne" ? "कुनै डाटा उपलब्ध छैन" : "No data available"}
            </p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium line-clamp-2">{getTitle(item)}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{getDescription(item)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={offset <= 0} onClick={() => setOffset((p) => Math.max(0, p - limit))}>
                  <ChevronLeft className="h-4 w-4" /><span className="hidden xs:inline ml-1">{locale === "ne" ? "अघिल्लो" : "Previous"}</span>
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-4">{Math.floor(offset / limit) + 1}</span>
                <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setOffset((p) => p + limit)}>
                  <span className="hidden xs:inline mr-1">{locale === "ne" ? "पछिल्लो" : "Next"}</span><ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
