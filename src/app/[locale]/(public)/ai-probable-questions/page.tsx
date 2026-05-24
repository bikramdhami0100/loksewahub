"use client";

import { useState } from "react";
import { Brain, Target, TrendingUp, BarChart3 } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGsapFadeIn } from "@/hooks/use-gsap";

const examTypes = [
  { value: "loksewa", label: "Loksewa" },
  { value: "tsc", label: "TSC" },
  { value: "provincial", label: "Provincial" },
  { value: "banking", label: "Banking" },
  { value: "security", label: "Security" },
];

const subjects = [
  { value: "gk", label: "General Knowledge" },
  { value: "nepali", label: "Nepali" },
  { value: "english", label: "English" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science & Technology" },
  { value: "social", label: "Social Studies" },
  { value: "reasoning", label: "Logical Reasoning" },
  { value: "finance", label: "Finance & Accounting" },
];

interface Prediction {
  id: number;
  question: string;
  confidence: number;
  reason: string;
  topic: string;
}

const samplePredictions: Prediction[] = [
  { id: 1, question: "What is the primary objective of Nepal's 15th Five-Year Plan?", confidence: 92, reason: "Consistently asked in last 5 exams", topic: "Planning" },
  { id: 2, question: "Explain the role of the Public Service Commission in Nepal.", confidence: 88, reason: "Core constitutional topic", topic: "Constitution" },
  { id: 3, question: "What are the major causes of Nepal's trade deficit?", confidence: 85, reason: "Current economic issue", topic: "Economy" },
  { id: 4, question: "Describe the federal structure of Nepal under the 2015 Constitution.", confidence: 90, reason: "Key constitutional change", topic: "Federalism" },
  { id: 5, question: "What measures has Nepal taken for climate change adaptation?", confidence: 78, reason: "Emerging global focus area", topic: "Environment" },
  { id: 6, question: "Analyze the impact of tourism on Nepal's economy.", confidence: 81, reason: "Important economic sector", topic: "Tourism" },
];

export default function AiProbableQuestionsPage() {
  const { t } = useLocale();
  const ref = useGsapFadeIn();
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setPredictions(samplePredictions);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t("ai.probableQuestions")}
        subtitle={t("ai.predictSubtitle")}
      >
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Predictions</span>
        </div>
      </PageHeader>

      <div ref={ref} className="mb-8 rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("common.filter")} Exam Type</label>
            <Select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              options={examTypes}
              placeholder="Select exam type"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("common.filter")} Subject</label>
            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              options={subjects}
              placeholder="Select subject"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} disabled={loading || !examType} className="w-full gap-2">
              {loading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Generate Predictions
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("ai.predictTitle")}</h2>
            </div>
            <Badge variant="secondary" className="text-sm">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              {predictions.length} predictions
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {predictions.map((prediction, index) => (
              <Card key={prediction.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base leading-relaxed">
                      <span className="mr-2 text-sm text-muted-foreground">Q{index + 1}.</span>
                      {prediction.question}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      {prediction.topic}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("ai.confidence")}</span>
                      <span className={`font-semibold ${prediction.confidence >= 85 ? "text-emerald-600" : prediction.confidence >= 75 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                    <Progress
                      value={prediction.confidence}
                      variant={prediction.confidence >= 85 ? "success" : prediction.confidence >= 75 ? "warning" : "default"}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Why:</span> {prediction.reason}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
