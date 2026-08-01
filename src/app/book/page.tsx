import type { Metadata } from "next";
import { BookingVisitTracker } from "@/components/booking-visit-tracker";
import { services } from "@/config/services";
import { getLocalizedAddOns, getLocalizedServices } from "@/i18n/content";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";
import { BookingForm } from "./booking-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.bookTitle"), description: t("meta.bookDescription") };
}

type BookPageProps = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: BookPageProps) {
  const [{ service: selectedSlug }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = createTranslator(locale);
  const initialService = selectedSlug && services.some((service) => service.slug === selectedSlug)
    ? selectedSlug
    : "";

  return (
    <section className="booking-page">
      <BookingVisitTracker />
      <div className="container booking-shell">
        <header className="booking-intro">
          <p className="eyebrow">{t("booking.eyebrow")}</p>
          <h1>{t("booking.title")}</h1>
          <p>{t("booking.intro")}</p>
        </header>
        <BookingForm addOns={getLocalizedAddOns(locale)} initialService={initialService} services={getLocalizedServices(locale)} />
      </div>
    </section>
  );
}
