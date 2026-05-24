"use client";

import { useState } from "react";
import { BookOpen, FileText, Building2, Layers } from "lucide-react";
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
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";

const examTypeBadge: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  loksewa: "default",
  tsc: "success",
  provincial: "secondary",
  banking: "secondary",
  security: "warning",
  other: "outline",
};

export default function SyllabusPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [examType, setExamType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "12" });
  if (examType) queryParams.set("examType", examType);
  if (search) queryParams.set("search", search);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; examType: string;
    organization: string; description: string; topics?: Array<unknown>;
  }>(`/api/syllabus?${queryParams}`, currentPage);

  const syllabus = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  const examTypes = [...new Set(syllabus.map((s) => s.examType))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("syllabus.title")} subtitle={t("syllabus.subtitle")} />
      </div>

      <div ref={contentRef} className="mb-8 space-y-6">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder={t("syllabus.searchPlaceholder")}
          className="max-w-md"
        />
        {examTypes.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant={!examType ? "default" : "outline"}
              size="sm"
              onClick={() => { setExamType(""); setCurrentPage(1); }}
            >
              {t("notes.allSubjects")}
            </Button>
            {examTypes.map((type) => (
              <Button
                key={type}
                variant={examType === type ? "default" : "outline"}
                size="sm"
                onClick={() => { setExamType(type); setCurrentPage(1); }}
                className="capitalize"
              >
                <FileText className="h-4 w-4 mr-1" />
                {type}
              </Button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : syllabus.length === 0 ? (
        <EmptyState title={t("syllabus.noSyllabus")} description={t("common.noData")} />
      ) : (
        <>
          <CardGrid columns={3}>
            {syllabus.map((s) => (
              <Card key={s._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={examTypeBadge[s.examType] || "secondary"}>
                      {s.examType}
                    </Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {locale === "ne" && s.titleNe ? s.titleNe : s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{s.organization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="h-4 w-4 shrink-0" />
                    <span>{s.topics?.length || 0} topics</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-auto">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t("common.viewAll")}
                  </Button>
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
