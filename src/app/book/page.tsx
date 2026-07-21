import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { contactLinks } from "@/config/business";

export const metadata: Metadata = {
  title: "Book",
  description: "Start a booking request with Life's Details.",
};

export default function BookPage() {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">Booking request</p>
        <h1>Booking form placeholder</h1>
        <p className="muted">
          Phase 0 prepares this route. The structured booking request flow
          belongs to Phase 2, after the landing page is complete.
        </p>
        <a className="button button-primary" href={contactLinks.whatsapp}>
          <MessageCircle size={18} aria-hidden="true" />
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}
