import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage, parseLocale } from "@/i18n/config";
import { getLocalizedAddOns, getLocalizedServices } from "@/i18n/content";
import {
  createTranslator,
  translationKeys,
  translations,
} from "@/i18n/translations";

describe("internationalization", () => {
  it("accepts only supported locales and detects browser preferences", () => {
    expect(parseLocale("nl")).toBe("nl");
    expect(parseLocale("de")).toBeNull();
    expect(localeFromAcceptLanguage("fr-BE,fr;q=0.9,en;q=0.8")).toBe("fr");
    expect(localeFromAcceptLanguage("de-DE,de;q=0.9,en;q=0.8")).toBe("en");
  });

  it("keeps every locale complete and interpolates dynamic values", () => {
    for (const locale of ["en", "nl", "fr"] as const) {
      expect(Object.keys(translations[locale])).toHaveLength(translationKeys.length);
      for (const key of translationKeys) expect(translations[locale][key]).toBeTruthy();
    }

    expect(createTranslator("nl")("home.areaCopy", { radius: 20 })).toContain("20 km");
    expect(createTranslator("fr")("confirmation.thanks", { name: "Daniel" })).toBe("Merci, Daniel.");
  });

  it("localizes the bookable catalog without changing stable slugs", () => {
    const dutchServices = getLocalizedServices("nl");
    const frenchAddOns = getLocalizedAddOns("fr");

    expect(dutchServices.find((service) => service.slug === "refresh")?.duration).toContain("uur");
    expect(frenchAddOns.find((addOn) => addOn.slug === "pet-hair")?.name).toBe("Traitement des poils d'animaux");
  });
});
