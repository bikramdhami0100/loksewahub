"use client";

import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingGrid } from "@/components/shared/LoadingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";
import { Calendar, Building2, ExternalLink, Award } from "lucide-react";
import { useState } from "react";

export default function ResultsPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; category: string;
    organization: string; publishedDate: string; source: string; originalUrl?: string;
  }>(`/api/notices?category=result&page=${currentPage}&limit=12`, currentPage);

  const notices = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("notices.result")} subtitle={t("notices.subtitle")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{pagination.total} results</span>
          </div>
        </PageHeader>
      </div>

      <div ref={contentRef} className="mb-8">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setCurrentPage(1); }} placeholder={t("common.search")} className="max-w-md" />
      </div>

      {loading ? <LoadingGrid /> : notices.length === 0 ? (
        <EmptyState title={t("notices.noNotices")} description={t("common.noData")} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <Card key={notice._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <Badge variant="success" className="shrink-0 w-fit">Result</Badge>
                  <CardTitle className="text-base mt-2 line-clamp-2">
                    {locale === "ne" && notice.titleNe ? notice.titleNe : notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" /><span>{notice.organization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /><span>{new Date(notice.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />View Result
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
}
