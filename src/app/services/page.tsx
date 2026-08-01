import type { Metadata } from "next";
import { Check, Clock3 } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { getLocalizedServices } from "@/i18n/content";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";
import { analyticsEvents } from "@/lib/analytics";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.servicesTitle"), description: t("meta.servicesDescription") };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = createTranslator(locale);
  const services = getLocalizedServices(locale);
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t("nav.services")}</p>
          <h1>{t("services.title")}</h1>
          <p className="section-intro">
            {t("services.intro")}
          </p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" id={service.slug} key={service.slug}>
              <div className="service-card-topline">
                <span className="service-number">0{index + 1}</span>
                <span className="service-duration">
                  <Clock3 size={15} aria-hidden="true" />
                  {service.duration}
                </span>
              </div>
              <div>
                <h2>{service.name}</h2>
                <p className="service-best-for">{service.bestFor}</p>
              </div>
              <p className="service-description">{service.description}</p>
              <ul className="service-inclusions">
                {service.inclusions.map((inclusion) => (
                  <li key={inclusion}>
                    <Check size={16} aria-hidden="true" />
                    <span>{inclusion}</span>
                  </li>
                ))}
              </ul>
              <div className="service-card-footer">
                <p className="price">{service.priceLabel}</p>
                <TrackedLink
                  className="service-link"
                  event={analyticsEvents.serviceCardClick}
                  eventProperties={{ service: service.slug, placement: "services_page" }}
                  href={`/book?service=${service.slug}`}
                >
                  {t("services.request")}
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
        <p className="pricing-note">
          {t("services.note")}
        </p>
      </div>
    </section>
  );
}
