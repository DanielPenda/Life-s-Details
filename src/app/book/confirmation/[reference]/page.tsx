import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackedLink } from "@/components/tracked-link";
import { contactLinks } from "@/config/business";
import { analyticsEvents } from "@/lib/analytics";
import { hashBookingAccessToken } from "@/lib/booking-reference";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Request received", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ reference }, { token }] = await Promise.all([params, searchParams]);
  if (!token) notFound();

  const booking = await prisma.booking.findUnique({
    where: { publicReference: reference },
    select: {
      accessTokenHash: true,
      publicReference: true,
      preferredDate: true,
      preferredTimeWindow: true,
      customerName: true,
      postcode: true,
      city: true,
      vehicleMake: true,
      vehicleModel: true,
      estimatedPrice: true,
      service: { select: { name: true } },
      addOns: { select: { addOn: { select: { name: true } } } },
    },
  });

  if (!booking || booking.accessTokenHash !== hashBookingAccessToken(token)) notFound();

  return (
    <section className="section confirmation-page">
      <div className="container narrow confirmation-shell">
        <CheckCircle2 aria-hidden="true" className="confirmation-icon" />
        <p className="eyebrow">Request received</p>
        <h1>Thanks, {booking.customerName}.</h1>
        <p className="confirmation-lead">Your request is safely recorded. We will review it and contact you before confirming an appointment.</p>
        <div className="reference-box"><span>Booking reference</span><strong>{booking.publicReference}</strong><small>Keep this reference for any questions.</small></div>
        <dl className="confirmation-summary">
          <div><dt>Service</dt><dd>{booking.service.name}</dd></div>
          <div><dt>Vehicle</dt><dd>{booking.vehicleMake} {booking.vehicleModel}</dd></div>
          <div><dt>Preferred time</dt><dd>{booking.preferredDate.toLocaleDateString("en-BE", { dateStyle: "long", timeZone: "UTC" })} · {booking.preferredTimeWindow.toLowerCase()}</dd></div>
          <div><dt>Location</dt><dd>{booking.postcode} {booking.city}</dd></div>
          {booking.addOns.length ? <div><dt>Add-ons</dt><dd>{booking.addOns.map(({ addOn }) => addOn.name).join(", ")}</dd></div> : null}
          <div><dt>Starting estimate</dt><dd>{booking.estimatedPrice === null ? "After inspection" : `€${Number(booking.estimatedPrice).toFixed(0)}`}</dd></div>
        </dl>
        <div className="next-steps"><h2>What happens next?</h2><ol><li>We check the requested service, location and timing.</li><li>We contact you using your preferred method.</li><li>Your appointment is only confirmed after you accept the final details.</li></ol></div>
        <TrackedLink className="button button-primary" event={analyticsEvents.whatsappClick} eventProperties={{ placement: "booking_confirmation" }} href={contactLinks.whatsapp} target="_blank"><MessageCircle aria-hidden="true" size={18} /> Ask a question on WhatsApp</TrackedLink>
      </div>
    </section>
  );
}
