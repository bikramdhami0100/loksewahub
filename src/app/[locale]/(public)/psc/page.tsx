"use client";

import { useState, useEffect } from "react";
import { Bell, MapPin, Award, ExternalLink, Calendar, Loader2, FileText, X, Download, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface PscFile {
  id: number;
  location: string;
  name: string;
  extension: string;
  size: number;
  file_type: string;
}

interface PscItem {
  id: number;
  title?: string;
  title_np?: string;
  shown_heading?: string;
  heading?: string;
  details?: string;
  notice_no?: string;
  upload_date?: string;
  date_upload?: string;
  type?: string;
  slug?: string;
  is_scroll?: number;
  interview_start?: string;
  interview_end?: string;
  advertise_nos?: string[];
  files?: PscFile[];
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const tabs = [
  { id: "notices", label: { en: "Notices & Advertisements", ne: "सूचना र विज्ञापन" }, icon: Bell },
  { id: "exam-centers", label: { en: "Exam Centers", ne: "परीक्षा केन्द्र" }, icon: MapPin },
  { id: "results", label: { en: "Written Results", ne: "लिखित परिणाम" }, icon: Award },
] as const;

export default function PscPage() {
  const { locale } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const [activeTab, setActiveTab] = useState<"notices" | "exam-centers" | "results">("notices");
  const [notices, setNotices] = useState<PscItem[]>([]);
  const [examCenters, setExamCenters] = useState<PscItem[]>([]);
  const [results, setResults] = useState<PscItem[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PscItem | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedItem(null);
    const endpoint = activeTab === "notices" ? "notices" : activeTab === "exam-centers" ? "exam-centers" : "results";
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    fetch(`/api/psc/${endpoint}?${params}`)
      .then((r) => r.json())
      .then((d) => {
        let items: PscItem[] = [];
        if (activeTab === "notices") {
          items = d?.data?.children?.data || [];
        } else {
          items = d?.data?.dataList?.data || [];
        }
        if (activeTab === "notices") {
          setNotices(items);
        } else if (activeTab === "exam-centers") {
          setExamCenters(items);
        } else {
          setResults(items);
        }
        setHasMore(items.length >= 10);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const items = activeTab === "notices" ? notices : activeTab === "exam-centers" ? examCenters : results;

  const getTitle = (item: PscItem) => {
    if (activeTab === "notices") {
      return locale === "ne" && item.title_np ? item.title_np : item.title || "";
    }
    return stripHtml(item.shown_heading || item.heading || "");
  };

  return (
    <div className="flex flex-col">
      <section ref={headerRef} className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4"><Award className="mr-1 h-3.5 w-3.5" />Public Service Commission Nepal</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {locale === "ne" ? "लोक सेवा आयोग" : "Loksewa Aayog (PSC Nepal)"}
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            {locale === "ne" ? "लाइभ डाटा पीएससी नेपालबाट सिधा" : "Live data fetched directly from psc.gov.np"}
          </p>
        </div>
      </section>

      <section ref={contentRef} className="border-t bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 mb-8 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setPage(1); }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {locale === "ne" ? tab.label.ne : tab.label.en}
                </button>
              );
            })}
          </div>

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
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8">
              <div className="relative w-full max-w-3xl mx-4 rounded-xl border bg-card shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b bg-card px-6 py-4 rounded-t-xl z-10">
                  <h2 className="text-lg font-semibold truncate pr-4">
                    {locale === "ne" ? "विवरण" : "Details"}
                  </h2>
                  <button onClick={() => setSelectedItem(null)} className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-6 py-6 space-y-5">
                  <div>
                    <h3 className="text-base font-medium leading-relaxed">{getTitle(selectedItem)}</h3>
                    {selectedItem.notice_no && (
                      <p className="text-sm text-muted-foreground mt-1">Notice No: {selectedItem.notice_no}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{selectedItem.upload_date || selectedItem.date_upload}</span>
                    {selectedItem.type && <Badge variant="outline" className="text-[10px]">{selectedItem.type}</Badge>}
                    {selectedItem.interview_start && (
                      <span>Interview: {selectedItem.interview_start}{selectedItem.interview_end !== selectedItem.interview_start ? ` - ${selectedItem.interview_end}` : ""}</span>
                    )}
                    {selectedItem.advertise_nos && selectedItem.advertise_nos.length > 0 && (
                      <span>Advertise: {selectedItem.advertise_nos.join(", ")}</span>
                    )}
                  </div>

                  {selectedItem.details && (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedItem.details }} />
                    </div>
                  )}

                  {selectedItem.files && selectedItem.files.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {locale === "ne" ? "संलग्न फाइलहरू" : "Attached Files"}
                      </h4>
                      <div className="space-y-2">
                        {selectedItem.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.location || file.file_type}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Download className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{file.name || "Download"}</p>
                              {file.size && <p className="text-[11px] text-muted-foreground">{formatSize(file.size)}</p>}
                            </div>
                            <Badge variant="outline" className="shrink-0 text-[10px]">{file.extension?.toUpperCase()}</Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                      {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
                    </Button>
                    <a href="https://psc.gov.np" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-3.5 w-3.5" />psc.gov.np</Button>
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
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{item.upload_date || item.date_upload}</span>
                        {activeTab === "results" && item.type && (
                          <Badge variant="outline" className="ml-auto text-[10px]">{item.type}</Badge>
                        )}
                      </div>
                      {activeTab === "exam-centers" && item.notice_no && (
                        <p className="text-[10px] text-muted-foreground mt-1">Notice: {item.notice_no}</p>
                      )}
                      {item.files && item.files.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1">{item.files.length} file(s) attached</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4 mr-1" />{locale === "ne" ? "अघिल्लो" : "Previous"}
                </Button>
                <span className="text-sm text-muted-foreground px-4">Page {page}</span>
                <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
                  {locale === "ne" ? "पछिल्लो" : "Next"}<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
