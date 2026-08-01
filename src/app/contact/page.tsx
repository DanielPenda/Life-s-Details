import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";
import { analyticsEvents } from "@/lib/analytics";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.contactTitle"), description: t("meta.contactDescription") };
}

export default async function ContactPage() {
  const t = createTranslator(await getLocale());
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">{t("footer.contact")}</p>
        <h1>{t("contact.title")}</h1>
        <p className="muted">{t("contact.copy")}</p>
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
            <span>{t("contact.phone")}</span>
            <strong>{businessInfo.phone.display}</strong>
          </TrackedLink>
          <TrackedLink
            className="contact-row card"
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "email", placement: "contact_page" }}
            href={contactLinks.email}
          >
            <Mail aria-hidden="true" />
            <span>{t("contact.email")}</span>
            <strong>{businessInfo.email}</strong>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
