"use client";

import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AiTutorHeader({
  isOffline,
  aiLang,
  onLangChange,
}: {
  isOffline: boolean;
  aiLang: "en" | "ne";
  onLangChange: (lang: "en" | "ne") => void;
}) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold sm:text-base">AI Tutor</h2>
          <p className="text-xs text-muted-foreground">{isOffline ? "Offline mode" : "Powered by Gemini"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isOffline && <Badge variant="destructive" className="hidden text-xs sm:inline-flex">Offline</Badge>}
        <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
          {aiLang === "en" ? "English" : "नेपाली"}
        </Badge>
        <div className="flex rounded-lg border p-0.5">
          <button
            onClick={() => onLangChange("en")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
              aiLang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >EN</button>
          <button
            onClick={() => onLangChange("ne")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
              aiLang === "ne" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >ने</button>
        </div>
      </div>
    </div>
  );
}
