"use client";

import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Brain,
  BookOpen,
  DollarSign,
} from "lucide-react";

const chartCards = [
  {
    icon: Users,
    title: "User Registrations Over Time",
    description: "New user signups per month",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Eye,
    title: "Notice Views",
    description: "Total notice page views per month",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Brain,
    title: "Test Attempts",
    description: "Mock tests and quiz attempts",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: BookOpen,
    title: "Popular Subjects",
    description: "Most viewed study subjects",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: DollarSign,
    title: "Revenue",
    description: "Subscription revenue overview",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
];

export default function AdminAnalyticsPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const chartsRef = useGsapFadeIn(0.1);
  const summaryRef = useGsapFadeIn(0.2);

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            {t("admin.analytics")}
          </h1>
          <p className="text-muted-foreground mt-1">Track platform performance and user engagement</p>
        </div>
        <Select
          options={[
            { value: "7d", label: "Last 7 days" },
            { value: "30d", label: "Last 30 days" },
            { value: "90d", label: "Last 90 days" },
            { value: "1y", label: "This year" },
          ]}
          placeholder="Last 30 days"
          className="w-full sm:w-40"
        />
      </div>

      <div ref={summaryRef} className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Page Views</p>
            <p className="text-2xl font-bold mt-1">284.5K</p>
            <Badge variant="success" className="mt-2 text-[10px]">+18.2%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground">Avg. Session</p>
            <p className="text-2xl font-bold mt-1">4m 32s</p>
            <Badge variant="success" className="mt-2 text-[10px]">+5.1%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground">Bounce Rate</p>
            <p className="text-2xl font-bold mt-1">32.1%</p>
            <Badge variant="warning" className="mt-2 text-[10px]">+2.3%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold mt-1">1,247</p>
            <Badge variant="success" className="mt-2 text-[10px]">+12.5%</Badge>
          </CardContent>
        </Card>
      </div>

      <div ref={chartsRef} className="grid gap-6 md:grid-cols-2">
        {chartCards.map((chart) => (
          <Card key={chart.title}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${chart.bg}`}>
                <chart.icon className={`h-5 w-5 ${chart.color}`} />
              </div>
              <div>
                <CardTitle className="text-sm">{chart.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{chart.description}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-52 flex items-center justify-center border border-dashed rounded-lg border-border">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Chart placeholder</p>
                  <p className="text-xs text-muted-foreground/60">Integrate with your charting library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
