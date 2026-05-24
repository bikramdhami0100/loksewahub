"use client";

import { Search, Sparkles, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, DATE_RANGES } from "./ArticleCard";

interface CurrentAffairFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onResetPage: () => void;
  t: (key: string) => string;
}

export function CurrentAffairFilters({
  search, onSearchChange, category, onCategoryChange,
  dateRange, onDateRangeChange, onResetPage, t,
}: CurrentAffairFiltersProps) {
  const handleCategory = (cat: string) => { onCategoryChange(cat); onResetPage(); };
  const handleDateRange = (range: string) => { onDateRangeChange(range); onResetPage(); };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { onSearchChange(e.target.value); onResetPage(); }}
            placeholder={t("currentAffairs.searchPlaceholder")}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {DATE_RANGES.map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => handleDateRange(range)}
          >
            {t(`currentAffairs.${range}`)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleCategory(cat)}
          >
            {cat === "all" ? t("common.all") : cat}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="secondary">
          <Sparkles className="h-4 w-4 mr-2" />
          {t("currentAffairs.generateMcq")}
        </Button>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t("currentAffairs.monthlyPdf")}
        </Button>
      </div>
    </div>
  );
}
