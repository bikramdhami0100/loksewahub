"use client";

import { useState } from "react";
import { Eye, EyeOff, Sparkles, Brain, Calendar, BookOpen } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
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

export default function OldQuestionsPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleAnswers, setVisibleAnswers] = useState<Set<string>>(new Set());
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.15);

  const queryParams = new URLSearchParams({ page: String(currentPage), limit: "10" });
  if (subject) queryParams.set("subject", subject);
  if (search) queryParams.set("search", search);

  const { data, loading } = usePaginatedApi<{
    _id: string; question: string; questionNe?: string; subject: string;
    examType: string; year?: number; difficulty: string; type: string;
    correctAnswer?: string; explanation?: string; options?: string[];
  }>(`/api/questions?${queryParams}`, currentPage);

  const questions = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };
  const subjects = [...new Set(questions.map((q) => q.subject))];

  const toggleAnswer = (id: string) => {
    setVisibleAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const diffVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    easy: "success",
    medium: "warning",
    hard: "destructive",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div ref={headerRef}>
        <PageHeader title={t("oldQuestions.title")} subtitle={t("oldQuestions.subtitle")} />
      </div>

      <div ref={contentRef} className="mb-8 flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder={t("common.search")}
          className="flex-1"
        />
        {subjects.length > 0 && (
          <Select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setCurrentPage(1); }}
            options={[
              { value: "", label: t("notes.allSubjects") },
              ...subjects.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
            ]}
            className="w-full sm:w-44"
          />
        )}
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : questions.length === 0 ? (
        <EmptyState title={t("oldQuestions.noQuestions")} description={t("common.noData")} />
      ) : (
        <>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <Card key={q._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize">{q.subject}</Badge>
                    <Badge variant={diffVariant[q.difficulty] || "secondary"}>{q.difficulty}</Badge>
                    {q.year && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {q.year}
                      </Badge>
                    )}
                    <Badge variant="outline">{q.type}</Badge>
                  </div>
                  <CardTitle className="text-base font-medium">
                    <span className="text-muted-foreground mr-2">#{idx + 1 + (currentPage - 1) * 10}</span>
                    {locale === "ne" && q.questionNe ? q.questionNe : q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`p-2.5 rounded-md border text-sm ${
                            visibleAnswers.has(q._id) && q.correctAnswer === String.fromCharCode(97 + oi)
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                              : "border-border"
                          }`}
                        >
                          <span className="font-mono mr-2 text-muted-foreground">
                            {String.fromCharCode(97 + oi)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAnswer(q._id)}
                    >
                      {visibleAnswers.has(q._id) ? (
                        <><EyeOff className="h-4 w-4 mr-2" />{t("oldQuestions.hideAnswer")}</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" />{t("oldQuestions.showAnswer")}</>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t("oldQuestions.aiExplain")}
                    </Button>
                  </div>

                  {visibleAnswers.has(q._id) && q.correctAnswer && (
                    <div className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        Correct Answer: {q.correctAnswer}
                      </p>
                      {q.explanation && (
                        <p className="text-sm text-muted-foreground mt-2">{q.explanation}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
