import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackedLink } from "@/components/tracked-link";
import { contactLinks } from "@/config/business";
import { localeTags } from "@/i18n/config";
import { localizeAddOnName, localizeServiceName } from "@/i18n/content";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";
import { analyticsEvents } from "@/lib/analytics";
import { hashBookingAccessToken } from "@/lib/booking-reference";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.confirmationTitle"), robots: { index: false, follow: false } };
}
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ reference }, { token }, locale] = await Promise.all([params, searchParams, getLocale()]);
  const t = createTranslator(locale);
  if (!token) notFound();

  const booking = await prisma.booking.findUnique({
    where: { publicReference: reference },
    select: {
      accessTokenHash: true,
      publicReference: true,
      preferredDate: true,
      appointmentStartAt: true,
      appointmentEndAt: true,
      customerName: true,
      postcode: true,
      city: true,
      vehicleMake: true,
      vehicleModel: true,
      estimatedPrice: true,
      service: { select: { name: true, slug: true } },
      addOns: { select: { addOn: { select: { name: true, slug: true } } } },
    },
  });

  if (!booking || booking.accessTokenHash !== hashBookingAccessToken(token)) notFound();

  return (
    <section className="section confirmation-page">
      <div className="container narrow confirmation-shell">
        <CheckCircle2 aria-hidden="true" className="confirmation-icon" />
        <p className="eyebrow">{t("confirmation.eyebrow")}</p>
        <h1>{t("confirmation.thanks", { name: booking.customerName })}</h1>
        <p className="confirmation-lead">{t("confirmation.lead")}</p>
        <div className="reference-box"><span>{t("confirmation.reference")}</span><strong>{booking.publicReference}</strong><small>{t("confirmation.keepReference")}</small></div>
        <dl className="confirmation-summary">
          <div><dt>{t("booking.step.service")}</dt><dd>{localizeServiceName(locale, booking.service.slug, booking.service.name)}</dd></div>
          <div><dt>{t("booking.step.vehicle")}</dt><dd>{booking.vehicleMake} {booking.vehicleModel}</dd></div>
          <div><dt>{t("confirmation.requested")}</dt><dd>{booking.appointmentStartAt?.toLocaleString(localeTags[locale], { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Brussels" })}</dd></div>
          <div><dt>{t("booking.step.location")}</dt><dd>{booking.postcode} {booking.city}</dd></div>
          {booking.addOns.length ? <div><dt>{t("confirmation.addons")}</dt><dd>{booking.addOns.map(({ addOn }) => localizeAddOnName(locale, addOn.slug, addOn.name)).join(", ")}</dd></div> : null}
          <div><dt>{t("confirmation.estimate")}</dt><dd>{booking.estimatedPrice === null ? t("confirmation.afterInspection") : `€${Number(booking.estimatedPrice).toFixed(0)}`}</dd></div>
        </dl>
        <div className="next-steps"><h2>{t("confirmation.nextTitle")}</h2><ol><li>{t("confirmation.next1")}</li><li>{t("confirmation.next2")}</li><li>{t("confirmation.next3")}</li></ol></div>
        <TrackedLink className="button button-primary" event={analyticsEvents.whatsappClick} eventProperties={{ placement: "booking_confirmation" }} href={contactLinks.whatsapp} target="_blank"><MessageCircle aria-hidden="true" size={18} /> {t("confirmation.whatsapp")}</TrackedLink>
      </div>
    </section>
  );
}
