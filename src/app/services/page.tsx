import type { Metadata } from "next";
import { Check, Clock3 } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { services } from "@/config/services";
import { analyticsEvents } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Car Detailing Services",
  description:
    "Compare mobile car-detailing packages from Life's Details in Aalter, from routine maintenance to a complete detail.",
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h1>Choose the right level of care.</h1>
          <p className="section-intro">
            These starting packages make it easier to begin. Vehicle size and
            condition are confirmed before the final scope and estimate.
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
                  Request this service
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
        <p className="pricing-note">
          Package content and starting prices remain configurable. A revised
          estimate is always discussed before additional work begins.
        </p>
      </div>
    </section>
  );
}
