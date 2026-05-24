"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Bell,
  BellRing,
  BookOpen,
  FileText,
  Megaphone,
  Newspaper,
  CheckCheck,
  Trash2,
  ArrowRight,
} from "lucide-react";

const initialNotifications = [
  {
    id: "1",
    type: "notice",
    title: "New Vacancy Announcement",
    message: "Public Service Commission has published new vacancy for Section Officer.",
    date: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "material",
    title: "New Study Notes Available",
    message: "Nepali Constitution notes have been added to the library.",
    date: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "result",
    title: "Mock Test Result",
    message: "You scored 42/50 in General Knowledge mock test.",
    date: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "update",
    title: "Syllabus Updated",
    message: "Loksewa Section Officer syllabus has been revised.",
    date: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "current-affairs",
    title: "Daily Current Affairs",
    message: "New current affairs update for May 20, 2026 is available.",
    date: "3 days ago",
    read: true,
  },
  {
    id: "6",
    type: "notice",
    title: "Exam Schedule Published",
    message: "Upcoming Loksewa exams schedule for 2083 has been released.",
    date: "5 days ago",
    read: true,
  },
  {
    id: "7",
    type: "material",
    title: "AI Questions Generated",
    message: "New AI-predicted questions for upcoming exams are ready.",
    date: "1 week ago",
    read: true,
  },
];

const typeIcons: Record<string, React.ElementType> = {
  notice: Megaphone,
  material: BookOpen,
  result: FileText,
  update: Bell,
  "current-affairs": Newspaper,
};

const typeColors: Record<string, string> = {
  notice: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  material: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  result: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  update: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  "current-affairs": "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
};

export default function NotificationsPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const contentRef = useGsapFadeIn(0.2);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-8 max-w-3xl">
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
            <BellRing className="h-7 w-7 text-primary" />
            {t("dashboard.notifications")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No unread notifications"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All {notifications.length > 0 && `(${notifications.length})`}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div ref={contentRef}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications"
            description={filter === "unread" ? "You're all caught up!" : "No notifications yet"}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const colorClass = typeColors[notif.type] || "text-muted-foreground bg-muted";
              return (
                <Card
                  key={notif.id}
                  className={`transition-colors ${!notif.read ? "border-l-2 border-l-primary bg-primary/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {!notif.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-muted-foreground">{notif.date}</span>
                          <button
                            onClick={() => toggleRead(notif.id)}
                            className="text-[11px] text-primary hover:underline"
                          >
                            {notif.read ? "Mark unread" : "Mark read"}
                          </button>
                          <button
                            onClick={() => removeNotification(notif.id)}
                            className="text-[11px] text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
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
