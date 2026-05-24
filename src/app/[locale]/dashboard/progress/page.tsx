"use client";

import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BookOpen,
  Brain,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const subjects = [
  { name: "General Knowledge", progress: 72, questions: 450, accuracy: 76, color: "blue" },
  { name: "Nepali", progress: 58, questions: 210, accuracy: 68, color: "purple" },
  { name: "English", progress: 85, questions: 320, accuracy: 82, color: "emerald" },
  { name: "Mathematics", progress: 45, questions: 180, accuracy: 60, color: "amber" },
  { name: "G.K. (Nepal)", progress: 90, questions: 520, accuracy: 88, color: "rose" },
  { name: "Service Related", progress: 35, questions: 95, accuracy: 55, color: "cyan" },
];

const weakAreas = [
  { topic: "Ancient Nepal History", subject: "Nepali", accuracy: 42 },
  { topic: "Trigonometry", subject: "Mathematics", accuracy: 38 },
  { topic: "Prepositions", subject: "English", accuracy: 45 },
  { topic: "Nepal Geography", subject: "General Knowledge", accuracy: 48 },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
};

export default function ProgressPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const overallRef = useGsapFadeIn(0.1);
  const subjectsRef = useGsapFadeIn(0.2);
  const bottomRef = useGsapFadeIn(0.3);

  const overallAccuracy = Math.round(
    subjects.reduce((sum, s) => sum + s.accuracy, 0) / subjects.length
  );

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          {t("dashboard.progress")}
        </h1>
        <p className="text-muted-foreground mt-1">Track your exam preparation journey</p>
      </div>

      <div ref={overallRef} className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-3xl font-bold text-primary">1,775</p>
            <p className="text-xs text-muted-foreground mt-1">Total Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-3xl font-bold text-purple-500">{overallAccuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-3xl font-bold text-emerald-500">64%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-3xl font-bold text-amber-500">12</p>
            <p className="text-xs text-muted-foreground mt-1">Tests Taken</p>
          </CardContent>
        </Card>
      </div>

      <Card ref={overallRef}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Overall Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">64%</span>
            <div className="flex-1">
              <Progress value={64} variant="success" className="h-3" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            6 of 12 subjects completed &middot; Keep going!
          </p>
        </CardContent>
      </Card>

      <div ref={subjectsRef}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          Per-Subject Progress
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{subject.name}</CardTitle>
                  <Badge variant={subject.accuracy >= 70 ? "success" : subject.accuracy >= 50 ? "warning" : "destructive"}>
                    {subject.accuracy}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress
                  value={subject.progress}
                  variant={subject.progress >= 70 ? "success" : "default"}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{subject.questions} questions</span>
                  <span>{subject.progress}% complete</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div ref={bottomRef} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Accuracy Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border border-dashed rounded-lg border-border">
              <p className="text-sm text-muted-foreground">Accuracy over time chart placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Weak Areas
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              Practice All <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.map((area) => (
              <div key={area.topic} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{area.topic}</p>
                  <p className="text-xs text-muted-foreground">{area.subject}</p>
                </div>
                <Badge variant="destructive" className="shrink-0 ml-2">
                  {area.accuracy}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
