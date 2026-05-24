"use client";

import { MessageSquare } from "lucide-react";

export const suggestedQuestions = [
  "What is the structure of Nepali government?",
  "Explain the PSC examination process",
  "Key features of Nepal's constitution",
  "Tips for Loksewa preparation",
  "Current economic challenges in Nepal",
  "How to prepare for GK section?",
  "नेपाल सरकारको संरचना के हो?",
  "लोकसेवा परीक्षाको प्रक्रिया बताउनुहोस्",
];

export function SuggestedQuestions({ onSelect, locale }: { onSelect: (q: string) => void; locale: string }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{locale === "ne" ? "सुझाव प्रश्नहरू" : "Suggested questions"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
