"use client";

import { useState, useEffect } from "react";
import { Bell, ExternalLink, Calendar, Loader2, FileText, X, Download, ChevronLeft, ChevronRight, Search, Building } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface NrbItem {
  post_title: string;
  post_content: string;
  post_date: string;
  post_modified: string;
  post_thumbnail: boolean;
  post_type: string;
  slug: string | null;
  file_type: string | null;
  filesize: string;
  is_new: boolean;
}

function formatSize(size: string) {
  return size || "";
}

const typeLabels: Record<string, string> = {
  FOREX: "Forex",
  PDM: "Public Debt",
  GSD: "General Services",
  RED: "Research",
  FISD: "Financial Institutions",
  FMD: "Financial Markets",
  CMD: "Capital Markets",
  DHN: "Digital & IT",
  FLAMINGO_CONTACT: "Contact",
  FLAMINGO_INBOUND: "Inbound",
  GALLERY_POST_TYPE: "Gallery",
  JNP: "JNP",
  OFG: "Office of Governor",
  PSD: "Payment Systems",
  SID: "Supervision",
};

export default function NrbPage() {
  const { locale } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const [posts, setPosts] = useState<NrbItem[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NrbItem | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedItem(null);
    const params = new URLSearchParams({ page: String(page), per_page: "20" });
    if (search) params.set("q", search);
    fetch(`/api/nrb/posts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        const items: NrbItem[] = d?.data?.payload || [];
        setPosts(items);
        setHasMore(items.length >= 20);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const getFileName = (item: NrbItem) => {
    if (!item.slug) return null;
    const parts = item.slug.split("/");
    return parts[parts.length - 1] || "Download";
  };

  return (
    <div className="flex flex-col">
      <section ref={headerRef} className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4"><Building className="mr-1 h-3.5 w-3.5" />Nepal Rastra Bank</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {locale === "ne" ? "नेपाल राष्ट्र बैंक" : "Nepal Rastra Bank (NRB)"}
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            {locale === "ne" ? "लाइभ डाटा एनआरबीबाट सिधा" : "Live data fetched directly from nrb.org.np"}
          </p>
        </div>
      </section>

      <section ref={contentRef} className="border-t bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={locale === "ne" ? "खोज्नुहोस्..." : "Search..."}
              className="w-full h-10 pl-9 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
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
                    <h3 className="text-base font-medium leading-relaxed">{selectedItem.post_title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">{typeLabels[selectedItem.post_type] || selectedItem.post_type}</Badge>
                      {selectedItem.is_new && <Badge className="text-[10px]">New</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{selectedItem.post_date}</span>
                    {selectedItem.filesize && <span>{formatSize(selectedItem.filesize)}</span>}
                  </div>

                  {selectedItem.post_content && (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm whitespace-pre-wrap">{selectedItem.post_content}</p>
                    </div>
                  )}

                  {selectedItem.slug && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {locale === "ne" ? "संलग्न फाइल" : "Attached File"}
                      </h4>
                      <a
                        href={selectedItem.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Download className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{getFileName(selectedItem)}</p>
                          {selectedItem.filesize && <p className="text-[11px] text-muted-foreground">{formatSize(selectedItem.filesize)}</p>}
                        </div>
                        {selectedItem.file_type && <Badge variant="outline" className="shrink-0 text-[10px]">{selectedItem.file_type.toUpperCase()}</Badge>}
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                      {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
                    </Button>
                    <a href="https://www.nrb.org.np" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-3.5 w-3.5" />nrb.org.np</Button>
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
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-20">
              {locale === "ne" ? "कुनै डाटा उपलब्ध छैन" : "No data available"}
            </p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((item, i) => (
                  <Card key={`${item.post_type}-${item.post_date}-${i}`} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium line-clamp-2">{item.post_title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{item.post_date}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">{typeLabels[item.post_type] || item.post_type}</Badge>
                      </div>
                      {item.slug && (
                        <p className="text-[10px] text-muted-foreground mt-1">PDF available</p>
                      )}
                      {item.filesize && (
                        <p className="text-[10px] text-muted-foreground">{item.filesize}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" /><span className="hidden xs:inline ml-1">{locale === "ne" ? "अघिल्लो" : "Previous"}</span>
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-4">{page}</span>
                <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
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
