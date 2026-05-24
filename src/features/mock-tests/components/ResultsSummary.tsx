"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

export function ResultsSummary({
  questions,
  answers,
  totalScore,
  totalQuestions,
  onBack,
  t,
}: {
  questions: Question[];
  answers: Record<number, string>;
  totalScore: number;
  totalQuestions: number;
  onBack: () => void;
  t: (key: string) => string;
}) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="space-y-4 pt-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary">{Math.round((totalScore / totalQuestions) * 100)}%</div>
          <p className="mt-2 text-muted-foreground">{t("mockTests.accuracy")}</p>
        </div>
        <Progress value={(totalScore / totalQuestions) * 100} />
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`rounded-lg border p-3 ${
                answers[q.id] === q.correctAnswer
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-red-200 bg-red-50 dark:bg-red-950/20"
              }`}
            >
              <p className="text-sm font-medium">Q{i + 1}. {q.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Correct: {q.options.find((o) => o.id === q.correctAnswer)?.text}
              </p>
            </div>
          ))}
        </div>
        <Button onClick={onBack} className="w-full">Back to Tests</Button>
      </CardContent>
    </Card>
  );
}
