"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/providers/locale-provider";
import { LocaleLink } from "@/components/shared/LocaleLink";
import {
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/notices", label: "Notices", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin" || pathname === "/en/admin" || pathname === "/ne/admin";
    return pathname.includes(href);
  };

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <LocaleLink href="/admin" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>Admin</span>
        </LocaleLink>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <LocaleLink
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </LocaleLink>
          );
        })}
      </div>
      <div className="p-4 border-t border-border/50">
        <LocaleLink
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to Dashboard
        </LocaleLink>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 border-r border-border/50 min-h-screen sticky top-0 h-screen">
          {sidebarContent}
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-background border-r border-border shadow-xl z-50 animate-in slide-in-from-left">
              {sidebarContent}
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 lg:hidden">
            <div className="flex items-center gap-3 p-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open admin sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="font-semibold text-sm">Admin</span>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
