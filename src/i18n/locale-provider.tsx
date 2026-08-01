"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { translate, type TranslationKey } from "@/i18n/translations";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslations() {
  const locale = useLocale();
  return (key: TranslationKey, values?: Record<string, string | number>) =>
    translate(locale, key, values);
}
