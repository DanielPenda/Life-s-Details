import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { BookingVisitTracker } from "@/components/booking-visit-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { services } from "@/config/services";
import { analyticsEvents } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Book a Detail",
  description:
    "Start a mobile car-detailing enquiry with Life's Details in Aalter by WhatsApp, phone, or email.",
};

type BookPageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const { service: selectedSlug } = await searchParams;
  const selectedService = services.find((service) => service.slug === selectedSlug);

  return (
    <section className="section enquiry-page">
      <BookingVisitTracker />
      <div className="container narrow stack">
        <p className="eyebrow">Booking enquiry</p>
        <h1>Let&apos;s find the right detail for your car.</h1>
        <p className="muted">
          {selectedService
            ? `You selected ${selectedService.name}. Contact us with your vehicle model, condition, postcode and preferred timing.`
            : "Contact us with your vehicle model, condition, postcode and preferred timing. We will confirm the package, estimate and appointment with you."}
        </p>
        {selectedService ? (
          <div className="selected-service card">
            <span>Selected service</span>
            <strong>{selectedService.name}</strong>
            <small>{selectedService.priceLabel} · {selectedService.duration}</small>
          </div>
        ) : null}
        <div className="contact-list">
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.whatsappClick}
            eventProperties={{ placement: "booking_page" }}
            href={contactLinks.whatsapp}
            target="_blank"
          >
            <MessageCircle aria-hidden="true" />
            <span>WhatsApp</span>
            <strong>{businessInfo.whatsapp.display}</strong>
          </TrackedLink>
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "phone", placement: "booking_page" }}
            href={contactLinks.phone}
          >
            <Phone aria-hidden="true" />
            <span>Phone</span>
            <strong>{businessInfo.phone.display}</strong>
          </TrackedLink>
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "email", placement: "booking_page" }}
            href={contactLinks.email}
          >
            <Mail aria-hidden="true" />
            <span>Email</span>
            <strong>{businessInfo.email}</strong>
          </TrackedLink>
        </div>
        <p className="form-phase-note">
          A structured online booking form is intentionally reserved for Phase 2.
        </p>
      </div>
    </section>
  );
}
