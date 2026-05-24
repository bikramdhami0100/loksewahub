"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface Article {
  _id: string;
  title: string;
  titleNe?: string;
  summary: string;
  category: string;
  date: string;
  source?: string;
  tags?: string[];
}

export const categoryColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  politics: "default",
  economy: "success",
  sports: "secondary",
  science: "warning",
  international: "outline",
  appointment: "secondary",
  budget: "destructive",
  disaster: "destructive",
  award: "success",
};

export const CATEGORIES = [
  "all", "politics", "economy", "sports", "science",
  "international", "appointment", "budget", "disaster", "award",
] as const;

export const DATE_RANGES = ["today", "thisWeek", "thisMonth", "last3Months"] as const;

export function ArticleCard({ article, locale }: { article: Article; locale: string }) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={categoryColors[article.category] || "secondary"}>
            {article.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(article.date).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-base line-clamp-2">
          {locale === "ne" && article.titleNe ? article.titleNe : article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <CardDescription className="text-sm line-clamp-3">
          {article.summary}
        </CardDescription>
        {article.source && (
          <div className="mt-auto pt-2 text-xs text-muted-foreground">
            Source: {article.source}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
