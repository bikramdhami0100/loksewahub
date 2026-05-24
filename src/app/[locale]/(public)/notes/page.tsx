"use client";

import { useState } from "react";
import { Bookmark, BookOpen, Download, Filter, BookmarkCheck } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { CardGrid } from "@/components/shared/CardGrid";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingGrid } from "@/components/shared/LoadingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";

export default function NotesPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "12" });
  if (subject) queryParams.set("subject", subject);
  if (search) queryParams.set("search", search);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; subject: string;
    description: string; downloadCount: number; tags?: string[];
  }>(`/api/notes?${queryParams}`, currentPage);

  const notes = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const uniqueSubjects = [...new Set(notes.map((n) => n.subject))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("notes.title")} subtitle={t("notes.subtitle")} />
      </div>

      <div ref={contentRef} className="mb-8 space-y-6">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder={t("common.search")}
          className="max-w-md"
        />
        {uniqueSubjects.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t("notes.subjects")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!subject ? "default" : "outline"}
                size="sm"
                onClick={() => { setSubject(""); setCurrentPage(1); }}
              >
                {t("notes.allSubjects")}
              </Button>
              {uniqueSubjects.map((sub) => (
                <Button
                  key={sub}
                  variant={subject === sub ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSubject(sub); setCurrentPage(1); }}
                  className="capitalize"
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : notes.length === 0 ? (
        <EmptyState title={t("notes.noNotes")} description={t("common.noData")} />
      ) : (
        <>
          <CardGrid columns={3}>
            {notes.map((note) => (
              <Card key={note._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="shrink-0 capitalize">{note.subject}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => toggleBookmark(note._id)}
                    >
                      {bookmarked.has(note._id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-base mt-2 line-clamp-2">
                    {locale === "ne" && note.titleNe ? note.titleNe : note.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{note.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{note.downloadCount?.toLocaleString() || 0}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/api/notes/${note._id}/download`}>
                        <Download className="h-4 w-4 mr-2" />
                        {t("common.download")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardGrid>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
