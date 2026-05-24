"use client";

import { useState } from "react";
import { Clock, ListChecks, Trophy, BarChart, ArrowRight } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { CardGrid } from "@/components/shared/CardGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingGrid } from "@/components/shared/LoadingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { usePaginatedApi } from "@/hooks/use-api";

export default function MockTestsPage() {
  const { t, locale } = useLocale();
  const [examType, setExamType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "12" });
  if (examType) queryParams.set("examType", examType);
  if (difficulty) queryParams.set("difficulty", difficulty);

  const { data, loading } = usePaginatedApi<{
    _id: string; title: string; titleNe?: string; description: string;
    examType: string; duration: number; totalMarks: number;
    difficulty: string; questions: Array<unknown>; isFree: boolean;
  }>(`/api/mock-tests?${queryParams}`, currentPage);

  const tests = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };

  const diffBadge: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    easy: "success",
    medium: "warning",
    hard: "destructive",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("mockTests.title")} subtitle={t("mockTests.subtitle")} />
      </div>

      <div ref={contentRef} className="mb-8 flex flex-col sm:flex-row gap-4">
        <Select
          value={examType}
          onChange={(e) => { setExamType(e.target.value); setCurrentPage(1); }}
          options={[
            { value: "", label: t("notes.allSubjects") },
            { value: "loksewa", label: "Loksewa" },
            { value: "tsc", label: "TSC" },
            { value: "banking", label: "Banking" },
            { value: "security", label: "Security" },
            { value: "provincial", label: "Provincial" },
          ]}
          className="w-full sm:w-44"
        />
        <Select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
          options={[
            { value: "", label: "All Levels" },
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
          ]}
          className="w-full sm:w-40"
        />
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : tests.length === 0 ? (
        <EmptyState title={t("mockTests.noTests")} description={t("common.noData")} />
      ) : (
        <>
          <CardGrid columns={3}>
            {tests.map((test) => (
              <Card key={test._id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{test.examType}</Badge>
                    <Badge variant={diffBadge[test.difficulty] || "secondary"}>{test.difficulty}</Badge>
                    {test.isFree && <Badge variant="success">Free</Badge>}
                  </div>
                  <CardTitle className="text-base">
                    {locale === "ne" && test.titleNe ? test.titleNe : test.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4" />
                      {test.questions?.length || 0} {t("mockTests.questions")}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      {test.totalMarks} marks
                    </span>
                  </div>
                  <Button className="mt-auto gap-2" asChild>
                    <a href={`/${locale}/mock-tests/${test._id}`}>
                      {t("mockTests.startTest")}
                      <ArrowRight className="h-4 w-4" />
                    </a>
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
