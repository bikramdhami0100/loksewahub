export interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ExamType =
  | "loksewa"
  | "tsc"
  | "provincial"
  | "banking"
  | "security"
  | "other";

export type NoticeCategory =
  | "vacancy"
  | "result"
  | "exam-schedule"
  | "interview"
  | "admit-card"
  | "syllabus"
  | "circular"
  | "other";

export type QuestionType = "mcq" | "descriptive" | "short-answer" | "one-liner";

export type DifficultyLevel = "easy" | "medium" | "hard";

export type SubscriptionTier = "free" | "basic" | "premium" | "enterprise";

export type UserRole = "user" | "admin" | "superadmin";

export interface NavLink {
  href: string;
  labelEn: string;
  labelNe: string;
  icon?: string;
  requiresAuth?: boolean;
  isAdmin?: boolean;
}
