import type { Metadata } from "next";
import { services } from "@/config/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Service package placeholders for Life's Details.",
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container stack">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h1>Choose the right level of care</h1>
          <p className="muted">
            Phase 0 keeps services configurable and ready for Phase 1 content.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card card" id={service.slug} key={service.slug}>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p className="price">{service.priceLabel}</p>
              <a className="button button-secondary" href="/book">
                Request this service
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
