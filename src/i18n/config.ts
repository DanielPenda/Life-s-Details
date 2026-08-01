export const locales = ["en", "nl", "fr"] as const;
export type Locale = (typeof locales)[number];

export const localeCookieName = "lifesdetails_locale";

export function parseLocale(value: unknown): Locale | null {
  return typeof value === "string" && locales.includes(value as Locale)
    ? (value as Locale)
    : null;
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return "en";
  for (const part of value.toLowerCase().split(",")) {
    const locale = parseLocale(part.trim().split(";")[0]?.split("-")[0]);
    if (locale) return locale;
  }
  return "en";
}

export const localeTags: Record<Locale, string> = {
  en: "en-BE",
  nl: "nl-BE",
  fr: "fr-BE",
};
