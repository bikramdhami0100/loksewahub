"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Trash2,
  Mail,
} from "lucide-react";

const allUsers = [
  { id: "1", name: "Ram Sharma", email: "ram@example.com", role: "user", subscription: "free", joinDate: "May 20, 2026" },
  { id: "2", name: "Sita Poudel", email: "sita@example.com", role: "user", subscription: "premium", joinDate: "May 19, 2026" },
  { id: "3", name: "Hari Adhikari", email: "hari@example.com", role: "admin", subscription: "enterprise", joinDate: "May 15, 2026" },
  { id: "4", name: "Gita Thapa", email: "gita@example.com", role: "user", subscription: "basic", joinDate: "May 12, 2026" },
  { id: "5", name: "Krishna Rai", email: "krishna@example.com", role: "user", subscription: "free", joinDate: "May 10, 2026" },
  { id: "6", name: "Bishnu Gurung", email: "bishnu@example.com", role: "user", subscription: "premium", joinDate: "May 8, 2026" },
  { id: "7", name: "Durga Khanal", email: "durga@example.com", role: "admin", subscription: "enterprise", joinDate: "May 5, 2026" },
  { id: "8", name: "Prakash Neupane", email: "prakash@example.com", role: "user", subscription: "basic", joinDate: "May 3, 2026" },
  { id: "9", name: "Sunita Sharma", email: "sunita@example.com", role: "user", subscription: "free", joinDate: "Apr 28, 2026" },
  { id: "10", name: "Anil KC", email: "anil@example.com", role: "user", subscription: "premium", joinDate: "Apr 25, 2026" },
];

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

export default function AdminUsersPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const tableRef = useGsapFadeIn(0.1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filtered = allUsers.filter((user) => {
    const matchesSearch = !search || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">View and manage all registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setCurrentPage(1); }} placeholder="Search users..." className="w-full sm:w-72" />
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          options={roleOptions}
          placeholder="All Roles"
          className="w-full sm:w-40"
        />
      </div>

      <Card ref={tableRef}>
        <CardContent className="p-0">
          {paginated.length === 0 ? (
            <EmptyState title="No users found" description="Try adjusting your search or filters" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Subscription</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                    <th className="text-right p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="font-medium truncate max-w-[120px] sm:max-w-none">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell truncate max-w-[160px]">{user.email}</td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant={user.role === "admin" ? "warning" : "secondary"} className="text-[10px]">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant={user.subscription === "premium" || user.subscription === "enterprise" ? "success" : "secondary"} className="text-[10px]">
                          {user.subscription}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell text-xs">{user.joinDate}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Send email">
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title={user.role === "admin" ? "Remove admin" : "Make admin"}>
                            {user.role === "admin" ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Delete user">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
