"use client";

import { useState } from "react";
import { Bell, Calendar, Building2, ExternalLink } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { CardGrid } from "@/components/shared/CardGrid";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingGrid } from "@/components/shared/LoadingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";

const categoryVariants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  vacancy: "default",
  result: "success",
  "exam-schedule": "secondary",
  interview: "warning",
  "admit-card": "outline",
  syllabus: "secondary",
  circular: "destructive",
  other: "outline",
};

export default function NoticesPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "12" });
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; category: string; organization: string;
    publishedDate: string; source: string; originalUrl?: string;
  }>(`/api/notices?${queryParams}`, currentPage);

  const notices = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("notices.title")} subtitle={t("notices.subtitle")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>{pagination.total} {t("notices.allNotices").toLowerCase()}</span>
          </div>
        </PageHeader>
      </div>

      <div ref={contentRef} className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setCurrentPage(1); }}
            placeholder={t("common.search")}
            className="flex-1"
          />
          <Select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
            options={[
              { value: "", label: t("notices.allNotices") },
              { value: "vacancy", label: t("notices.vacancy") },
              { value: "result", label: t("notices.result") },
              { value: "exam-schedule", label: t("notices.examSchedule") },
              { value: "interview", label: t("notices.interview") },
              { value: "admit-card", label: t("notices.admitCard") },
              { value: "syllabus", label: t("notices.syllabus") },
              { value: "circular", label: t("notices.circular") },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : notices.length === 0 ? (
        <EmptyState title={t("notices.noNotices")} description={t("common.noData")} />
      ) : (
        <>
          <CardGrid columns={3}>
            {notices.map((notice) => (
              <Card key={notice._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={categoryVariants[notice.category] || "secondary"}
                      className="shrink-0"
                    >
                      {t(`notices.${notice.category}`) || notice.category}
                    </Badge>
                    <a href={notice.originalUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  <CardTitle className="text-base mt-2 line-clamp-2">
                    {locale === "ne" && notice.titleNe ? notice.titleNe : notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{notice.organization || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{new Date(notice.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-auto pt-2 text-xs text-muted-foreground">
                    {t("notices.source")}: {notice.source}
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
