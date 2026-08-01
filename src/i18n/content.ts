import { addOns } from "@/config/add-ons";
import { services } from "@/config/services";
import type { Locale } from "@/i18n/config";
import { createTranslator, type TranslationKey } from "@/i18n/translations";

const serviceKeys = {
  refresh: "service.refresh",
  "deep-clean": "service.deep-clean",
  "full-detail": "service.full-detail",
} as const;

const addOnKeys = {
  "pet-hair": "addon.pet-hair",
  "seat-stains": "addon.seat-stains",
  "odour-treatment": "addon.odour-treatment",
} as const;

export function getLocalizedServices(locale: Locale) {
  const t = createTranslator(locale);
  return services.map((service) => {
    const prefix = serviceKeys[service.slug];
    return {
      ...service,
      name: t(`${prefix}.name` as TranslationKey),
      description: t(`${prefix}.description` as TranslationKey),
      bestFor: t(`${prefix}.bestFor` as TranslationKey),
      duration: t(`${prefix}.duration` as TranslationKey),
      priceLabel: t(`${prefix}.price` as TranslationKey),
      inclusions: service.inclusions.map((_, index) =>
        t(`${prefix}.inclusion${index + 1}` as TranslationKey),
      ),
    };
  });
}

export function getLocalizedAddOns(locale: Locale) {
  const t = createTranslator(locale);
  return addOns.map((addOn) => {
    const prefix = addOnKeys[addOn.slug];
    return {
      ...addOn,
      name: t(`${prefix}.name` as TranslationKey),
      description: t(`${prefix}.description` as TranslationKey),
    };
  });
}

export function localizeServiceName(locale: Locale, slug: string, fallback: string) {
  const prefix = serviceKeys[slug as keyof typeof serviceKeys];
  return prefix
    ? createTranslator(locale)(`${prefix}.name` as TranslationKey)
    : fallback;
}

export function localizeAddOnName(locale: Locale, slug: string, fallback: string) {
  const prefix = addOnKeys[slug as keyof typeof addOnKeys];
  return prefix
    ? createTranslator(locale)(`${prefix}.name` as TranslationKey)
    : fallback;
}
