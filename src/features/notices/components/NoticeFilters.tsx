"use client";

import { SearchInput } from "@/components/shared/SearchInput";
import { Select } from "@/components/ui/select";

interface NoticeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  t: (key: string) => string;
}

export function NoticeFilters({ search, onSearchChange, category, onCategoryChange, t }: NoticeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("common.search")}
        className="flex-1"
      />
      <Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={[
          { value: "", label: t("notices.allNotices") },
          { value: "vacancy", label: t("notices.vacancy") },
          { value: "result", label: t("notices.result") },
          { value: "exam-schedule", label: t("notices.examSchedule") },
          { value: "interview", label: t("notices.interview") },
          { value: "admit-card", label: t("notices.admitCard") },
          { value: "syllabus", label: t("notices.syllabus") },
          { value: "circular", label: t("notices.circular") },
        ]}
        className="w-full sm:w-48"
      />
    </div>
  );
}
