"use client";

import { Clock, ListChecks, BarChart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MockTest {
  _id: string;
  title: string;
  titleNe?: string;
  description: string;
  examType: string;
  duration: number;
  totalMarks: number;
  difficulty: string;
  questions: unknown[];
  isFree: boolean;
}

export const diffBadge: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
};

export function TestCard({ test, locale, t }: { test: MockTest; locale: string; t: (key: string) => string }) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
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
            <Clock className="h-4 w-4" />{test.duration} min
          </span>
          <span className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />{test.questions?.length || 0} {t("mockTests.questions")}
          </span>
          <span className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />{test.totalMarks} marks
          </span>
        </div>
        <Button className="mt-auto gap-2" asChild>
          <a href={`/${locale}/mock-tests/${test._id}`}>
            {t("mockTests.startTest")}<ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
