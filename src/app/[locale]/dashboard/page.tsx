"use client";

import { useSession } from "next-auth/react";
import { BookOpen, Brain, Trophy, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();

  const { data: stats } = useApi<{
    bookmarked: number; questionsAttempted: number; accuracy: number;
    testsTaken: number; recentActivity: Array<{ title: string; date: string }>;
  }>("/api/users/stats");

  return (
    <div className="space-y-6">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold">
          {t("dashboard.welcome")}, {session?.user?.name || "Student"}!
        </h1>
        <p className="text-muted-foreground">{t("dashboard.stats")}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: t("notes.title"), value: stats?.bookmarked ?? 0, color: "text-blue-500" },
          { icon: Brain, label: t("oldQuestions.questionsAttempted"), value: stats?.questionsAttempted ?? 0, color: "text-violet-500" },
          { icon: Trophy, label: t("mockTests.accuracy"), value: `${stats?.accuracy ?? 0}%`, color: "text-emerald-500" },
          { icon: TrendingUp, label: t("mockTests.leaderboard"), value: stats?.testsTaken ?? 0, color: "text-amber-500" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1">{activity.title}</span>
                    <span className="text-muted-foreground text-xs">{activity.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Start practicing to see your activity!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.continueLearning")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/notes">
              <Button variant="outline" className="w-full justify-between">
                {t("nav.notes")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mock-tests">
              <Button variant="outline" className="w-full justify-between">
                {t("nav.mockTests")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/old-questions">
              <Button variant="outline" className="w-full justify-between">
                {t("nav.oldQuestions")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
