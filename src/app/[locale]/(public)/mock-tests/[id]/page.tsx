"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGsapFadeIn } from "@/hooks/use-gsap";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correctAnswer: string;
}

const sampleQuestions: Question[] = [
  { id: 1, text: "Which article of the Constitution of Nepal guarantees the right to equality?", options: [
    { id: "a", text: "Article 12" }, { id: "b", text: "Article 16" }, { id: "c", text: "Article 18" }, { id: "d", text: "Article 20" },
  ], correctAnswer: "c" },
  { id: 2, text: "What is the term length of the President of Nepal?", options: [
    { id: "a", text: "4 years" }, { id: "b", text: "5 years" }, { id: "c", text: "6 years" }, { id: "d", text: "7 years" },
  ], correctAnswer: "b" },
  { id: 3, text: "Who appoints the Chief Justice of Nepal?", options: [
    { id: "a", text: "Prime Minister" }, { id: "b", text: "President" }, { id: "c", text: "Chief Justice" }, { id: "d", text: "Law Minister" },
  ], correctAnswer: "b" },
  { id: 4, text: "How many provinces does Nepal have?", options: [
    { id: "a", text: "5" }, { id: "b", text: "6" }, { id: "c", text: "7" }, { id: "d", text: "8" },
  ], correctAnswer: "c" },
  { id: 5, text: "Which is the largest political party in Nepal's current parliament?", options: [
    { id: "a", text: "Nepali Congress" }, { id: "b", text: "CPN-UML" }, { id: "c", text: "Maoist Centre" }, { id: "d", text: "RJP" },
  ], correctAnswer: "a" },
];

export default function MockTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const ref = useGsapFadeIn();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200);
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = sampleQuestions.length;
  const currentQuestion = sampleQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleAnswer = (optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const totalScore = submitted
    ? sampleQuestions.reduce((score, q) => (answers[q.id] === q.correctAnswer ? score + 1 : score), 0)
    : 0;

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Test Results" subtitle={`${t("mockTests.score")}: ${totalScore}/${totalQuestions}`} />
        <Card className="mx-auto max-w-2xl">
          <CardContent className="space-y-4 pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{Math.round((totalScore / totalQuestions) * 100)}%</div>
              <p className="mt-2 text-muted-foreground">{t("mockTests.accuracy")}</p>
            </div>
            <Progress value={(totalScore / totalQuestions) * 100} />
            <div className="space-y-2">
              {sampleQuestions.map((q, i) => (
                <div key={q.id} className={`rounded-lg border p-3 ${answers[q.id] === q.correctAnswer ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" : "border-red-200 bg-red-50 dark:bg-red-950/20"}`}>
                  <p className="text-sm font-medium">Q{i + 1}. {q.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Correct: {q.options.find((o) => o.id === q.correctAnswer)?.text}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => router.push("/mock-tests")} className="w-full">Back to Tests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Mock Test" subtitle={`Question ${currentIndex + 1} of ${totalQuestions}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            {formatTime(timeLeft)}
          </div>
          <Badge variant="secondary">{answeredCount}/{totalQuestions} answered</Badge>
        </div>
      </PageHeader>

      <div ref={ref} className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                <span className="mr-2 text-sm text-muted-foreground">Q{currentIndex + 1}.</span>
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "hover:border-muted-foreground/30 hover:bg-muted/50"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    answers[currentQuestion.id] === option.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}>
                    {option.id.toUpperCase()}
                  </span>
                  {option.text}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant={currentIndex === totalQuestions - 1 ? "destructive" : "outline"}
              onClick={() => {
                if (currentIndex === totalQuestions - 1) {
                  handleSubmit();
                } else {
                  setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                }
              }}
              className="gap-2"
            >
              {currentIndex === totalQuestions - 1 ? "Submit Test" : <>Next <ChevronRight className="h-4 w-4" /></>}
            </Button>
          </div>

          {answeredCount === totalQuestions && (
            <Button onClick={handleSubmit} className="w-full gap-2">
              <CheckCircle className="h-4 w-4" /> {t("mockTests.startTest")} - Submit All Answers
            </Button>
          )}
        </div>

        <div className="w-full lg:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {sampleQuestions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = i === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(i)}
                      className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-medium transition-all ${
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
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
              <Button onClick={handleSubmit} variant="destructive" className="mt-4 w-full text-xs" size="sm">
                {t("mockTests.viewResults")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
