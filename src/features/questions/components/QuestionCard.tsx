"use client";

import { Calendar, Eye, EyeOff, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Question {
  _id: string;
  question: string;
  questionNe?: string;
  subject: string;
  examType: string;
  year?: number;
  difficulty: string;
  type: string;
  correctAnswer?: string;
  explanation?: string;
  options?: string[];
}

export const diffVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
};

export function QuestionCard({
  question,
  index,
  locale,
  showAnswer,
  onToggleAnswer,
  t,
}: {
  question: Question;
  index: number;
  locale: string;
  showAnswer: boolean;
  onToggleAnswer: (id: string) => void;
  t: (key: string) => string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" className="capitalize">{question.subject}</Badge>
          <Badge variant={diffVariant[question.difficulty] || "secondary"}>{question.difficulty}</Badge>
          {question.year && (
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />{question.year}
            </Badge>
          )}
          <Badge variant="outline">{question.type}</Badge>
        </div>
        <CardTitle className="text-base font-medium">
          <span className="text-muted-foreground mr-2">#{index + 1}</span>
          {locale === "ne" && question.questionNe ? question.questionNe : question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.options && question.options.length > 0 && (
          <div className="space-y-2 mb-4">
            {question.options.map((opt, oi) => (
              <div
                key={oi}
                className={`p-2.5 rounded-md border text-sm ${
                  showAnswer && question.correctAnswer === String.fromCharCode(97 + oi)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-border"
                }`}
              >
                <span className="font-mono mr-2 text-muted-foreground">{String.fromCharCode(97 + oi)}.</span>
                {opt}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => onToggleAnswer(question._id)}>
            {showAnswer ? <><EyeOff className="h-4 w-4 mr-2" />{t("oldQuestions.hideAnswer")}</> : <><Eye className="h-4 w-4 mr-2" />{t("oldQuestions.showAnswer")}</>}
          </Button>
          <Button variant="ghost" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />{t("oldQuestions.aiExplain")}
          </Button>
        </div>

        {showAnswer && question.correctAnswer && (
          <div className="mt-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Correct Answer: {question.correctAnswer}
            </p>
            {question.explanation && (
              <p className="text-sm text-muted-foreground mt-2">{question.explanation}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
