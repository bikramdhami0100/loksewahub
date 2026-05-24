"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={cn("flex gap-2 sm:gap-3", message.role === "user" ? "flex-row-reverse" : "")}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9",
        message.role === "ai" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {message.role === "ai" ? <Bot className="h-4 w-4 sm:h-5 sm:w-5" /> : <User className="h-4 w-4 sm:h-5 sm:w-5" />}
      </div>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[75%] sm:px-5 sm:py-3",
        message.role === "ai" ? "bg-muted/50 text-foreground" : "bg-primary text-primary-foreground"
      )}>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words leading-relaxed dark:prose-invert">
          {message.content}
        </div>
        <div className={cn("mt-1 text-[10px]", message.role === "ai" ? "text-muted-foreground/60" : "text-primary-foreground/60")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-9 sm:w-9">
        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-muted/50 px-4 py-3 sm:px-5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
