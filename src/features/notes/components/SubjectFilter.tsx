"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubjectFilter({
  subjects,
  selected,
  onSelect,
  t,
}: {
  subjects: string[];
  selected: string;
  onSelect: (subject: string) => void;
  t: (key: string) => string;
}) {
  if (subjects.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4" />
        {t("notes.subjects")}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect("")}
        >
          {t("notes.allSubjects")}
        </Button>
        {subjects.map((sub) => (
          <Button
            key={sub}
            variant={selected === sub ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(sub)}
            className="capitalize"
          >
            {sub}
          </Button>
        ))}
      </div>
    </div>
  );
}
