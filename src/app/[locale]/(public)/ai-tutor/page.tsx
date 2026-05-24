"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, LogIn, MessageSquare, RefreshCw } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { useSession, signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is the structure of Nepali government?",
  "Explain the PSC examination process",
  "Key features of Nepal's constitution",
  "Tips for Loksewa preparation",
  "Current economic challenges in Nepal",
  "How to prepare for GK section?",
  "नेपाल सरकारको संरचना के हो?",
  "लोकसेवा परीक्षाको प्रक्रिया बताउनुहोस्",
];

export default function AiTutorPage() {
  const { t, locale } = useLocale();
  const headerRef = useGsapFadeIn();
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiLang, setAiLang] = useState<"en" | "ne">(locale === "ne" ? "ne" : "en");
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0 && status === "authenticated") {
      setMessages([
        {
          id: 1,
          role: "ai",
          content: aiLang === "ne"
            ? "नमस्ते! म एआई शिक्षक हुँ। तपाईंले नेपाली सरकारी परीक्षा, अध्ययन सुझाव वा कुनै पनि विषयको बारेमा सोध्न सक्नुहुन्छ।"
            : "Hello! I'm your AI Tutor. Ask me anything about Nepali government exams, study tips, or any subject you're preparing for.",
          timestamp: new Date(),
        },
      ]);
    }
  }, [status, aiLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setAiLang(locale === "ne" ? "ne" : "en");
  }, [locale]);

  const handleSend = async (question?: string) => {
    const text = (question || input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);
    setIsOffline(false);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          context: messages.slice(-4).map((m) => `${m.role}: ${m.content}`).join("\n"),
          language: aiLang,
        }),
      });

      if (res.status === 401) {
        signIn("google", { callbackUrl: window.location.pathname });
        return;
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (data.offline) {
        setIsOffline(true);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: data.answer || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
      const fallback: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: aiLang === "ne"
          ? "माफ गर्नुहोस्, जवाफ प्राप्त गर्न समस्या भयो। कृपया पुन: प्रयास गर्नुहोस्।"
          : "Sorry, I encountered an issue. Please try again or check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <PageHeader
            title={t("ai.tutor")}
            subtitle={t("ai.explainConcept")}
          />
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">
              {locale === "ne" ? "साइन इन गर्नुहोस्" : "Sign in to continue"}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {locale === "ne"
                ? "कृपया एआई शिक्षकसँग कुराकानी गर्न आफ्नो खातामा साइन इन गर्नुहोस्।"
                : "Please sign in to chat with the AI Tutor."}
            </p>
            <Button onClick={() => signIn("google", { callbackUrl: window.location.pathname })} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              {locale === "ne" ? "गुगलबाट साइन इन" : "Sign in with Google"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col px-4 py-4 sm:py-8">
      <div ref={headerRef}>
        <PageHeader title={t("ai.tutor")} subtitle={t("ai.explainConcept")} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold sm:text-base">AI Tutor</h2>
              <p className="text-xs text-muted-foreground">
                {isOffline ? "Offline mode" : "Powered by Gemini"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOffline && (
              <Badge variant="destructive" className="hidden text-xs sm:inline-flex">
                Offline
              </Badge>
            )}
            <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
              {aiLang === "en" ? "English" : "नेपाली"}
            </Badge>
            <div className="flex rounded-lg border p-0.5">
              <button
                onClick={() => setAiLang("en")}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
                  aiLang === "en"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setAiLang("ne")}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3",
                  aiLang === "ne"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ने
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 sm:gap-3",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9",
                  msg.role === "ai"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {msg.role === "ai" ? (
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[75%] sm:px-5 sm:py-3",
                  msg.role === "ai"
                    ? "bg-muted/50 text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words leading-relaxed dark:prose-invert">
                  {msg.content}
                </div>
                <div
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.role === "ai" ? "text-muted-foreground/60" : "text-primary-foreground/60"
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-9 sm:w-9">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-muted/50 px-4 py-3 sm:px-5">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center gap-2 text-xs text-destructive">
              <RefreshCw className="h-3 w-3" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 sm:p-6">
          {messages.length <= 1 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>
                  {locale === "ne" ? "सुझाव प्रश्नहरू" : "Suggested questions"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 sm:gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                locale === "ne"
                  ? "आफ्नो प्रश्न अंग्रेजी वा नेपालीमा टाइप गर्नुहोस्..."
                  : "Type your question in English or Nepali..."
              }
              className="min-h-[44px] flex-1 resize-none"
              rows={1}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-[44px] w-[44px] shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
