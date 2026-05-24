"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Bookmark,
  FileText,
  BookOpen,
  HelpCircle,
  Bell,
  Newspaper,
  ExternalLink,
  Trash2,
  FolderOpen,
} from "lucide-react";

const tabs = [
  { id: "all", label: "All Items", icon: Bookmark },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
  { id: "questions", label: "Questions", icon: HelpCircle },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "current-affairs", label: "Current Affairs", icon: Newspaper },
];

const bookmarkedItems = [
  { id: "1", type: "notes", title: "Nepali Constitution 2072", subject: "General Knowledge", date: "May 15, 2026", tags: ["loksewa", "constitution"] },
  { id: "2", type: "syllabus", title: "Section Officer Syllabus", subject: "Loksewa", date: "May 14, 2026", tags: ["loksewa", "syllabus"] },
  { id: "3", type: "questions", title: "GK Old Questions 2080", subject: "General Knowledge", date: "May 12, 2026", tags: ["mcq"] },
  { id: "4", type: "notes", title: "English Grammar Basics", subject: "English", date: "May 10, 2026", tags: ["grammar"] },
  { id: "5", type: "notices", title: "PSC Vacancy Announcement", subject: "Loksewa", date: "May 8, 2026", tags: ["vacancy"] },
  { id: "6", type: "current-affairs", title: "May 2026 Current Affairs", subject: "Current Affairs", date: "May 7, 2026", tags: ["monthly"] },
  { id: "7", type: "notes", title: "Nepali History Notes", subject: "Nepali", date: "May 5, 2026", tags: ["history"] },
  { id: "8", type: "syllabus", title: "TSC Teacher Syllabus", subject: "TSC", date: "May 3, 2026", tags: ["tsc", "teacher"] },
];

const typeConfig: Record<string, { color: string; bg: string }> = {
  notes: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  syllabus: { color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  questions: { color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  notices: { color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  "current-affairs": { color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
};

export default function BookmarksPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.2);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = bookmarkedItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-primary" />
          {t("dashboard.bookmarks")}
        </h1>
        <p className="text-muted-foreground mt-1">All your saved items in one place</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search bookmarks..." className="w-full sm:w-64" />
      </div>

      <div ref={contentRef}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No bookmarks found"
            description={search ? "Try a different search term" : "Bookmark items to see them here"}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const config = typeConfig[item.type] || { color: "text-muted-foreground", bg: "bg-muted" };
              const TypeIcon = tabs.find((t) => t.id === item.type)?.icon || Bookmark;
              return (
                <Card key={item.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <TypeIcon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-sm mt-2 line-clamp-1">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{item.subject}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">{item.date}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
