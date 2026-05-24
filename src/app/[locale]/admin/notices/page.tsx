"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  ExternalLink,
} from "lucide-react";

const initialNotices = [
  { id: "1", title: "Section Officer Vacancy 2083", category: "vacancy", status: "published", date: "May 20, 2026" },
  { id: "2", title: "Loksewa Result 2080", category: "result", status: "published", date: "May 18, 2026" },
  { id: "3", title: "TSC Teacher Exam Schedule", category: "exam-schedule", status: "draft", date: "May 16, 2026" },
  { id: "4", title: "Admit Card - Assistant Level", category: "admit-card", status: "published", date: "May 14, 2026" },
  { id: "5", title: "Interview Schedule - Admin Section", category: "interview", status: "draft", date: "May 12, 2026" },
  { id: "6", title: "Syllabus Update - Loksewa", category: "syllabus", status: "published", date: "May 10, 2026" },
  { id: "7", title: "Circular - Service Commission", category: "circular", status: "draft", date: "May 8, 2026" },
  { id: "8", title: "Banking Exam Notice", category: "vacancy", status: "published", date: "May 5, 2026" },
  { id: "9", title: "Provincial Exam Result", category: "result", status: "published", date: "Apr 30, 2026" },
  { id: "10", title: "Admit Card - Officer Level", category: "admit-card", status: "draft", date: "Apr 28, 2026" },
];

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "vacancy", label: "Vacancy" },
  { value: "result", label: "Result" },
  { value: "exam-schedule", label: "Exam Schedule" },
  { value: "interview", label: "Interview" },
  { value: "admit-card", label: "Admit Card" },
  { value: "syllabus", label: "Syllabus" },
  { value: "circular", label: "Circular" },
  { value: "other", label: "Other" },
];

const noticeCategories = [
  { value: "vacancy", label: "Vacancy" },
  { value: "result", label: "Result" },
  { value: "exam-schedule", label: "Exam Schedule" },
  { value: "interview", label: "Interview" },
  { value: "admit-card", label: "Admit Card" },
  { value: "syllabus", label: "Syllabus" },
  { value: "circular", label: "Circular" },
  { value: "other", label: "Other" },
];

export default function AdminNoticesPage() {
  const { t } = useLocale();
  const headerRef = useGsapFadeIn();
  const tableRef = useGsapFadeIn(0.1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<typeof initialNotices[0] | null>(null);
  const [notices, setNotices] = useState(initialNotices);
  const pageSize = 8;

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("vacancy");
  const [formContent, setFormContent] = useState("");

  const filtered = notices.filter((notice) => {
    const matchesSearch = !search || notice.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || notice.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormTitle("");
    setFormCategory("vacancy");
    setFormContent("");
    setShowModal(true);
  };

  const openEditModal = (notice: typeof initialNotices[0]) => {
    setEditingNotice(notice);
    setFormTitle(notice.title);
    setFormCategory(notice.category);
    setFormContent("Notice content...");
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingNotice) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingNotice.id ? { ...n, title: formTitle, category: formCategory } : n
        )
      );
    } else {
      const newNotice = {
        id: String(Date.now()),
        title: formTitle,
        category: formCategory,
        status: "draft",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
      setNotices((prev) => [newNotice, ...prev]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: n.status === "published" ? "draft" : "published" } : n))
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-8">
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Notice Management
          </h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage government notices</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          New Notice
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setCurrentPage(1); }} placeholder="Search notices..." className="w-full sm:w-72" />
        <Select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          options={categoryOptions}
          placeholder="All Categories"
          className="w-full sm:w-44"
        />
      </div>

      <Card ref={tableRef}>
        <CardContent className="p-0">
          {paginated.length === 0 ? (
            <EmptyState title="No notices found" description="Try adjusting your search or create a new notice" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Title</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="text-right p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((notice) => (
                    <tr key={notice.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <span className="font-medium truncate max-w-[200px] block">{notice.title}</span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-[10px]">{notice.category}</Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant={notice.status === "published" ? "success" : "warning"} className="text-[10px]">
                          {notice.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell text-xs">{notice.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(notice.id)} title={notice.status === "published" ? "Unpublish" : "Publish"}>
                            {notice.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(notice)} title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteNotice(notice.id)} title="Delete">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-background rounded-xl border border-border shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingNotice ? "Edit Notice" : "Create New Notice"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notice-title">Title</Label>
                <Input id="notice-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Enter notice title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice-category">Category</Label>
                <Select
                  id="notice-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  options={noticeCategories}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice-content">Content</Label>
                <Textarea id="notice-content" value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={6} placeholder="Enter notice content..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!formTitle.trim()} className="gap-2">
                  <Check className="h-4 w-4" />
                  {editingNotice ? "Update Notice" : "Create Notice"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
