"use client";

import { Calendar, Building2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Notice {
  _id: string;
  title: string;
  titleNe?: string;
  category: string;
  organization: string;
  publishedDate: string;
  source: string;
  originalUrl?: string;
}

export const categoryVariants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  vacancy: "default",
  result: "success",
  "exam-schedule": "secondary",
  interview: "warning",
  "admit-card": "outline",
  syllabus: "secondary",
  circular: "destructive",
  other: "outline",
};

export function NoticeCard({ notice, locale, t }: { notice: Notice; locale: string; t: (key: string) => string }) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Badge variant={categoryVariants[notice.category] || "secondary"} className="shrink-0">
            {t(`notices.${notice.category}`) || notice.category}
          </Badge>
          {notice.originalUrl && (
            <a href={notice.originalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
        <CardTitle className="text-base mt-2 line-clamp-2">
          {locale === "ne" && notice.titleNe ? notice.titleNe : notice.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{notice.organization || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{new Date(notice.publishedDate).toLocaleDateString()}</span>
        </div>
        <div className="mt-auto pt-2 text-xs text-muted-foreground">
          {t("notices.source")}: {notice.source}
        </div>
      </CardContent>
    </Card>
  );
}
