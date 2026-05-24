"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen, FileText, Download, ExternalLink, Trash2, FolderOpen } from "lucide-react";

const savedMaterials = [
  { id: "1", title: "Nepali Constitution 2072 - Full Text", subject: "General Knowledge", type: "PDF", size: "2.4 MB", date: "May 15, 2026" },
  { id: "2", title: "Section Officer Model Questions", subject: "Loksewa", type: "PDF", size: "1.8 MB", date: "May 14, 2026" },
  { id: "3", title: "English Grammar Handbook", subject: "English", type: "PDF", size: "3.2 MB", date: "May 12, 2026" },
  { id: "4", title: "Current Affairs May 2026", subject: "Current Affairs", type: "PDF", size: "1.1 MB", date: "May 10, 2026" },
  { id: "5", title: "Nepali History Timeline", subject: "Nepali", type: "PDF", size: "4.5 MB", date: "May 8, 2026" },
];

export default function SavedMaterialsPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.2);
  const [search, setSearch] = useState("");

  const filtered = savedMaterials.filter((item) => {
    return !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          {t("dashboard.saved") || "Saved Materials"}
        </h1>
        <p className="text-muted-foreground mt-1">Download and manage your study materials</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1">
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4" />
            All Materials
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Downloads
          </Button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search saved materials..." className="w-full sm:w-64" />
      </div>

      <div ref={contentRef}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No saved materials"
            description={search ? "Try a different search term" : "Save study materials to access them here"}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-sm mt-2 line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.type}</Badge>
                    <span className="text-[11px] text-muted-foreground">{item.size}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">{item.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
