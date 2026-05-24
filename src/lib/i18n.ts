import en from "@/messages/en.json";
import ne from "@/messages/ne.json";

export type Locale = "en" | "ne";
export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "ne"];

const messages: Record<Locale, Record<string, unknown>> = { en, ne };

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}

export function getTranslations(locale: Locale) {
  const msgs = getMessages(locale) as Record<string, Record<string, string>>;

  return (key: string): string => {
    const keys = key.split(".");
    let value: unknown = msgs;

    for (const k of keys) {
      if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "ne") return "ne";
  return "en";
}
