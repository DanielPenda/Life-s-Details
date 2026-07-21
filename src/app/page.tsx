import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BeforeAfterComparison } from "@/components/before-after-comparison";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { landingPageContent } from "@/config/content";
import { services } from "@/config/services";
import { analyticsEvents } from "@/lib/analytics";

const processSteps = [
  {
    title: "Choose a service",
    description: "Pick the package that best matches your vehicle today.",
  },
  {
    title: "Send vehicle details",
    description: "Tell us the size, condition and location of your car.",
  },
  {
    title: "Receive confirmation",
    description: "We confirm the scope, estimate and suitable appointment.",
  },
  {
    title: "Enjoy a cleaner car",
    description: "We come to the agreed location and take care of the detail.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">
              Mobile car detailing in {businessInfo.serviceArea.city}
            </p>
            <h1 id="hero-title">A cleaner car, without losing your day.</h1>
            <p className="hero-copy">
              Thoughtful interior and exterior detailing brought to an agreed
              location in Aalter and nearby areas. Clear packages, practical
              advice and no unnecessary upselling.
            </p>
            <div className="hero-actions">
              <TrackedLink
                className="button button-primary"
                event={analyticsEvents.heroBookingClick}
                eventProperties={{ placement: "hero" }}
                href="/book"
              >
                Book a Detail
                <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <Link className="button button-secondary" href="#services">
                View Services
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <MapPin size={17} aria-hidden="true" />
                Aalter 9880 + nearby areas
              </span>
              <span>
                <ShieldCheck size={17} aria-hidden="true" />
                Final scope agreed before work starts
              </span>
            </div>
          </div>
          <div className="hero-media">
            <Image
              alt="Detailed dark sports car photographed at sunset"
              className="hero-image"
              fill
              priority
              sizes="(min-width: 900px) 52vw, 100vw"
              src="/images/detailing-hero.jpg"
            />
            <div className="hero-media-caption">
              <Sparkles size={20} aria-hidden="true" />
              <span>Attention to every detail</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Service highlights">
        <div className="container trust-list">
          {landingPageContent.trustItems.map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section services-section" id="services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Services</p>
              <h2 id="services-title">The right level of care for your car.</h2>
            </div>
            <p className="section-intro">
              Start with the closest match. We confirm the final package after
              understanding the vehicle size and condition.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.slug}>
                <div className="service-card-topline">
                  <span className="service-number">0{index + 1}</span>
                  <span className="service-duration">
                    <Clock3 size={15} aria-hidden="true" />
                    {service.duration}
                  </span>
                </div>
                <div>
                  <h3>{service.name}</h3>
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
                    ariaLabel={`Start a ${service.name} enquiry`}
                    className="service-link"
                    event={analyticsEvents.serviceCardClick}
                    eventProperties={{ service: service.slug }}
                    href={`/book?service=${service.slug}`}
                  >
                    Choose service
                    <ChevronRight size={18} aria-hidden="true" />
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
          <p className="pricing-note">
            Starting prices are provisional and depend on vehicle size and
            condition. Any revised estimate is discussed before extra work.
          </p>
        </div>
      </section>

      <section className="section results-section" id="results" aria-labelledby="results-title">
        <div className="container results-layout">
          <div className="results-copy">
            <p className="eyebrow eyebrow-light">Before &amp; after</p>
            <h2 id="results-title">See what focused care can change.</h2>
            <p>
              Drag the control or use the buttons to explore the comparison.
              This is temporary demonstration imagery and will be replaced by
              genuine Life&apos;s Details work with publication consent.
            </p>
            <div className="results-proof-note">
              <Sparkles size={20} aria-hidden="true" />
              <span>Real project photography is the next content priority.</span>
            </div>
          </div>
          <BeforeAfterComparison />
        </div>
      </section>

      <section className="section process-section" id="process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title">From enquiry to clean car in four steps.</h2>
          </div>
          <ol className="process-grid">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span className="process-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section area-section" aria-labelledby="area-title">
        <div className="container area-layout">
          <div className="area-visual" aria-hidden="true">
            <div className="radius-ring radius-ring-outer" />
            <div className="radius-ring radius-ring-inner" />
            <div className="area-pin">
              <MapPin size={22} />
              <span>Aalter</span>
            </div>
          </div>
          <div className="area-copy">
            <p className="eyebrow">Service area</p>
            <h2 id="area-title">Based around Aalter 9880.</h2>
            <p>
              Mobile appointments are focused within approximately {landingPageContent.serviceRadiusKm} km
              of Aalter. Nearby locations are considered individually so the
              travel time and setup stay practical.
            </p>
            <div className="area-note">
              <MapPin size={20} aria-hidden="true" />
              <span>
                Travel fees may apply outside the core zone. Share your postcode
                and we will confirm before booking.
              </span>
            </div>
            <Link className="text-link" href="/contact">
              Check your location
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-layout">
          <div className="faq-heading">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title">Useful answers before you book.</h2>
            <p>
              Still unsure which service fits? A quick WhatsApp message is the
              easiest way to ask.
            </p>
          </div>
          <div className="faq-list">
            {landingPageContent.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <div className="container final-cta-inner">
          <div>
            <p className="eyebrow eyebrow-light">Ready when you are</p>
            <h2 id="final-cta-title">Give your car the attention it deserves.</h2>
            <p>Start an enquiry today. We will confirm the right service, estimate and timing with you.</p>
          </div>
          <div className="final-cta-actions">
            <Link className="button button-light" href="/book">
              Book your detail
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <TrackedLink
              className="button button-outline-light"
              event={analyticsEvents.whatsappClick}
              eventProperties={{ placement: "final_cta" }}
              href={contactLinks.whatsapp}
              target="_blank"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Ask on WhatsApp
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
