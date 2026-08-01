import { enBooking, frBooking, nlBooking } from "@/i18n/booking-messages";
import { enCommon, frCommon, nlCommon } from "@/i18n/common-messages";
import type { Locale } from "@/i18n/config";

const en = { ...enCommon, ...enBooking } as const;
export type TranslationKey = keyof typeof en;

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  nl: { ...nlCommon, ...nlBooking },
  fr: { ...frCommon, ...frBooking },
};

export function translate(
  locale: Locale,
  key: TranslationKey,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    dictionaries[locale][key],
  );
}

export function createTranslator(locale: Locale) {
  return (key: TranslationKey, values?: Record<string, string | number>) =>
    translate(locale, key, values);
}

export const translationKeys = Object.keys(en) as TranslationKey[];
export const translations = dictionaries;
