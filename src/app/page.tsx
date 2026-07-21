import { ArrowRight, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { businessInfo, contactLinks } from "@/config/business";
import { services } from "@/config/services";

export default function HomePage() {
  return (
    <>
      <section className="section hero">
        <div className="container hero-grid">
          <div className="stack">
            <p className="eyebrow">Now accepting requests around Aalter 9880</p>
            <h1>Your car deserves attention to every detail.</h1>
            <p className="hero-copy">
              Interior and exterior car-care services in Aalter and nearby
              areas, with simple contact options and clear package guidance.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/book">
                Book a Detail
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="button button-secondary" href={contactLinks.whatsapp}>
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-label="Life's Details service preview">
            <Sparkles size={28} aria-hidden="true" />
            <p>Mobile detailing, transparent packages, careful workmanship.</p>
          </div>
        </div>
      </section>

      <section className="section surface-band" aria-labelledby="services-title">
        <div className="container stack">
          <div className="section-heading">
            <p className="eyebrow">Phase 0 foundation</p>
            <h2 id="services-title">Service placeholders</h2>
            <p className="muted">
              These package cards establish the public shell. Final pricing and
              inclusions can be refined in Phase 1.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card card" key={service.slug}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p className="price">{service.priceLabel}</p>
                <a href={`/services#${service.slug}`}>View service</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="area-title">
        <div className="container split">
          <div>
            <p className="eyebrow">Local service area</p>
            <h2 id="area-title">Built for {businessInfo.serviceArea.city}</h2>
            <p className="muted">
              The first version focuses on {businessInfo.serviceArea.city}{" "}
              {businessInfo.serviceArea.postcode} and surrounding areas. Travel
              notes and radius settings are kept configurable.
            </p>
          </div>
          <div className="contact-card card">
            <MapPin aria-hidden="true" />
            <strong>Direct contact</strong>
            <a href={contactLinks.phone}>{businessInfo.phone.display}</a>
            <a href={contactLinks.email}>{businessInfo.email}</a>
          </div>
        </div>
      </section>
    </>
  );
}
