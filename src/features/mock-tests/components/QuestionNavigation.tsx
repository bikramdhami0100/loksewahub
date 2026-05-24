"use client";

import { CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuestionNavigation({
  totalQuestions,
  currentIndex,
  answers,
  onNavigate,
  onSubmit,
  t,
}: {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, string>;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
  t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Question Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-medium transition-all ${
                  isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                } ${
                  isAnswered
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isAnswered ? <CheckCircle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-primary" /> Answered
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Circle className="h-3 w-3" /> Unanswered
          </div>
        </div>
        <Button onClick={onSubmit} variant="destructive" className="mt-4 w-full text-xs" size="sm">
          {t("mockTests.viewResults")}
        </Button>
      </CardContent>
    </Card>
  );
}
