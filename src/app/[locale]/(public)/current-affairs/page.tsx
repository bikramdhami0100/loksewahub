"use client";

import { useState } from "react";
import { Newspaper, Calendar, Sparkles, Download, Search } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { CardGrid } from "@/components/shared/CardGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingGrid } from "@/components/shared/LoadingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";

const CATEGORIES = [
  "all", "politics", "economy", "sports", "science",
  "international", "appointment", "budget", "disaster", "award",
] as const;

const DATE_RANGES = ["today", "thisWeek", "thisMonth", "last3Months"] as const;

const categoryColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  politics: "default",
  economy: "success",
  sports: "secondary",
  science: "warning",
  international: "outline",
  appointment: "secondary",
  budget: "destructive",
  disaster: "destructive",
  award: "success",
};

export default function CurrentAffairsPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState("last3Months");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "12" });
  if (category !== "all") queryParams.set("category", category);
  if (dateRange !== "last3Months") queryParams.set("range", dateRange);
  if (search) queryParams.set("search", search);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; summary: string;
    category: string; date: string; source?: string; tags?: string[];
  }>(`/api/current-affairs?${queryParams}`, currentPage);

  const articles = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("currentAffairs.title")} subtitle={t("currentAffairs.subtitle")} />
      </div>

      <div ref={contentRef} className="mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={t("currentAffairs.searchPlaceholder")}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {DATE_RANGES.map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => { setDateRange(range); setCurrentPage(1); }}
            >
              {t(`currentAffairs.${range}`)}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => { setCategory(cat); setCurrentPage(1); }}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="secondary">
            <Sparkles className="h-4 w-4 mr-2" />
            {t("currentAffairs.generateMcq")}
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("currentAffairs.monthlyPdf")}
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : articles.length === 0 ? (
        <EmptyState title={t("common.noData")} description={t("currentAffairs.searchPlaceholder")} />
      ) : (
        <>
          <CardGrid columns={3}>
            {articles.map((article) => (
              <Card key={article._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={categoryColors[article.category] || "secondary"}>
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {locale === "ne" && article.titleNe ? article.titleNe : article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <CardDescription className="text-sm line-clamp-3">
                    {article.summary}
                  </CardDescription>
                  {article.source && (
                    <div className="mt-auto pt-2 text-xs text-muted-foreground">
                      Source: {article.source}
                    </div>
                  )}
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
