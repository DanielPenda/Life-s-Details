import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { analyticsEvents } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Life's Details in Aalter by phone, WhatsApp, or email.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">Contact</p>
        <h1>Talk directly with {businessInfo.name}.</h1>
        <p className="muted">
          Share your vehicle model, its current condition, your postcode and
          what result you want. We will help you choose the right service.
        </p>
        <div className="contact-list">
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.whatsappClick}
            eventProperties={{ placement: "contact_page" }}
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
            eventProperties={{ method: "phone", placement: "contact_page" }}
            href={contactLinks.phone}
          >
            <Phone aria-hidden="true" />
            <span>Phone</span>
            <strong>{businessInfo.phone.display}</strong>
          </TrackedLink>
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "email", placement: "contact_page" }}
            href={contactLinks.email}
          >
            <Mail aria-hidden="true" />
            <span>Email</span>
            <strong>{businessInfo.email}</strong>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
