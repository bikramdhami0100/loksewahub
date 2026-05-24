"use client";

import { Download, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Note {
  _id: string;
  title: string;
  titleNe?: string;
  subject: string;
  description: string;
  downloadCount: number;
  tags?: string[];
}

export function NoteCard({
  note,
  locale,
  bookmarked,
  onToggleBookmark,
  t,
}: {
  note: Note;
  locale: string;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  t: (key: string) => string;
}) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="shrink-0 capitalize">{note.subject}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onToggleBookmark(note._id)}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardTitle className="text-base mt-2 line-clamp-2">
          {locale === "ne" && note.titleNe ? note.titleNe : note.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">{note.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{note.downloadCount?.toLocaleString() || 0}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/notes/${note._id}/download`}>
              <Download className="h-4 w-4 mr-2" />
              {t("common.download")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
