"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface Prediction {
  id: number;
  question: string;
  confidence: number;
  reason: string;
  topic: string;
}

export function PredictionCard({ prediction, index }: { prediction: Prediction; index: number }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base leading-relaxed">
            <span className="mr-2 text-sm text-muted-foreground">Q{index + 1}.</span>
            {prediction.question}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">{prediction.topic}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className={`font-semibold ${prediction.confidence >= 85 ? "text-emerald-600" : prediction.confidence >= 75 ? "text-amber-600" : "text-muted-foreground"}`}>
              {prediction.confidence}%
            </span>
          </div>
          <Progress value={prediction.confidence} variant={prediction.confidence >= 85 ? "success" : prediction.confidence >= 75 ? "warning" : "default"} />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Why:</span> {prediction.reason}
        </p>
      </CardContent>
    </Card>
  );
}
