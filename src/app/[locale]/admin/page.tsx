"use client";

import { Shield, Users, FileText, BarChart3, Bell } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();

  const { data: stats } = useApi<{
    totalUsers: number; totalNotices: number; totalNotes: number; activeTests: number;
    recentUsers: Array<{ name: string; email: string; role: string }>;
  }>("/api/users?limit=5&admin=true");

  const items = [
    { icon: Users, label: t("admin.totalUsers"), value: stats?.totalUsers ?? 0, color: "text-blue-500", href: "/admin/users" },
    { icon: FileText, label: t("admin.totalNotices"), value: stats?.totalNotices ?? 0, color: "text-violet-500", href: "/admin/notices" },
    { icon: BarChart3, label: t("admin.totalNotes"), value: stats?.totalNotes ?? 0, color: "text-emerald-500", href: "/admin/notes" },
    { icon: Shield, label: t("admin.activeTests"), value: stats?.activeTests ?? 0, color: "text-amber-500", href: "/admin/mock-tests" },
  ];

  return (
    <div className="space-y-6">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold">{t("admin.dashboard")}</h1>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Link key={i} href={item.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.manageUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-2">
                {stats.recentUsers.map((user, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                    <span className="text-xs capitalize text-muted-foreground">{user.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            )}
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {t("admin.manageUsers")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.manageNotices")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/notices">
              <Button variant="outline" className="w-full justify-between">
                {t("admin.manageNotices")} <FileText className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-between">
                {t("admin.analytics")} <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
