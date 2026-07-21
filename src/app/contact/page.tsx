import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { businessInfo, contactLinks } from "@/config/business";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Life's Details by phone, WhatsApp, or email.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">Contact</p>
        <h1>Contact {businessInfo.name} directly</h1>
        <div className="contact-list">
          <a className="contact-row card" href={contactLinks.whatsapp}>
            <MessageCircle aria-hidden="true" />
            <span>WhatsApp</span>
            <strong>{businessInfo.whatsapp.display}</strong>
          </a>
          <a className="contact-row card" href={contactLinks.phone}>
            <Phone aria-hidden="true" />
            <span>Phone</span>
            <strong>{businessInfo.phone.display}</strong>
          </a>
          <a className="contact-row card" href={contactLinks.email}>
            <Mail aria-hidden="true" />
            <span>Email</span>
            <strong>{businessInfo.email}</strong>
          </a>
        </div>
      </div>
    </section>
  );
}
