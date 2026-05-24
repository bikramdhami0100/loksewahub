"use client";

import { SearchInput } from "@/components/shared/SearchInput";
import { Select } from "@/components/ui/select";

interface QuestionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  subjects: string[];
  t: (key: string) => string;
}

export function QuestionFilters({ search, onSearchChange, subject, onSubjectChange, subjects, t }: QuestionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("common.search")}
        className="flex-1"
      />
      {subjects.length > 0 && (
        <Select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          options={[
            { value: "", label: t("notes.allSubjects") },
            ...subjects.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
          ]}
          className="w-full sm:w-44"
        />
      )}
    </div>
  );
}
