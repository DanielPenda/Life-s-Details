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
import { getLocalizedServices } from "@/i18n/content";
import { getLocale } from "@/i18n/server";
import { createTranslator, type TranslationKey } from "@/i18n/translations";
import { analyticsEvents } from "@/lib/analytics";

const processSteps = [
  {
    title: "home.step1Title",
    description: "home.step1Copy",
  },
  {
    title: "home.step2Title",
    description: "home.step2Copy",
  },
  {
    title: "home.step3Title",
    description: "home.step3Copy",
  },
  {
    title: "home.step4Title",
    description: "home.step4Copy",
  },
] as const;

const trustItems = ["home.trust.mobile", "home.trust.packages", "home.trust.workmanship", "home.trust.area"] as const;
const faqs = Array.from({ length: 8 }, (_, index) => ({
  question: `home.faq${index + 1}q` as TranslationKey,
  answer: `home.faq${index + 1}a` as TranslationKey,
}));

export default async function HomePage() {
  const locale = await getLocale();
  const t = createTranslator(locale);
  const services = getLocalizedServices(locale);
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">
              {t("home.heroEyebrow", { city: businessInfo.serviceArea.city })}
            </p>
            <h1 id="hero-title">{t("home.heroTitle")}</h1>
            <p className="hero-copy">{t("home.heroCopy")}</p>
            <div className="hero-actions">
              <TrackedLink
                className="button button-primary"
                event={analyticsEvents.heroBookingClick}
                eventProperties={{ placement: "hero" }}
                href="/book"
              >
                {t("home.book")}
                <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <Link className="button button-secondary" href="#services">
                {t("home.viewServices")}
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <MapPin size={17} aria-hidden="true" />
                {t("home.areaShort")}
              </span>
              <span>
                <ShieldCheck size={17} aria-hidden="true" />
                {t("home.scope")}
              </span>
            </div>
          </div>
          <div className="hero-media">
            <Image
              alt={t("home.heroAlt")}
              className="hero-image"
              fill
              priority
              sizes="(min-width: 900px) 52vw, 100vw"
              src="/images/detailing-hero.jpg"
            />
            <div className="hero-media-caption">
              <Sparkles size={20} aria-hidden="true" />
              <span>{t("home.heroCaption")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label={t("home.highlights")}>
        <div className="container trust-list">
          {trustItems.map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {t(item)}
            </span>
          ))}
        </div>
      </section>

      <section className="section services-section" id="services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">{t("nav.services")}</p>
              <h2 id="services-title">{t("home.servicesTitle")}</h2>
            </div>
            <p className="section-intro">
              {t("home.servicesIntro")}
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
                    ariaLabel={t("home.startService", { service: service.name })}
                    className="service-link"
                    event={analyticsEvents.serviceCardClick}
                    eventProperties={{ service: service.slug }}
                    href={`/book?service=${service.slug}`}
                  >
                    {t("home.chooseService")}
                    <ChevronRight size={18} aria-hidden="true" />
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
          <p className="pricing-note">
            {t("home.pricingNote")}
          </p>
        </div>
      </section>

      <section className="section results-section" id="results" aria-labelledby="results-title">
        <div className="container results-layout">
          <div className="results-copy">
            <p className="eyebrow eyebrow-light">{t("home.beforeAfter")}</p>
            <h2 id="results-title">{t("home.resultsTitle")}</h2>
            <p>{t("home.resultsCopy")}</p>
            <div className="results-proof-note">
              <Sparkles size={20} aria-hidden="true" />
              <span>{t("home.resultsNote")}</span>
            </div>
          </div>
          <BeforeAfterComparison />
        </div>
      </section>

      <section className="section process-section" id="process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="eyebrow">{t("nav.process")}</p>
            <h2 id="process-title">{t("home.processTitle")}</h2>
          </div>
          <ol className="process-grid">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span className="process-number">{index + 1}</span>
                <h3>{t(step.title)}</h3>
                <p>{t(step.description)}</p>
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
            <p className="eyebrow">{t("home.serviceArea")}</p>
            <h2 id="area-title">{t("home.areaTitle")}</h2>
            <p>{t("home.areaCopy", { radius: landingPageContent.serviceRadiusKm })}</p>
            <div className="area-note">
              <MapPin size={20} aria-hidden="true" />
              <span>
                {t("home.areaNote")}
              </span>
            </div>
            <Link className="text-link" href="/contact">
              {t("home.checkLocation")}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-layout">
          <div className="faq-heading">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title">{t("home.faqTitle")}</h2>
            <p>{t("home.faqIntro")}</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{t(faq.question)}</summary>
                <p>{t(faq.answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <div className="container final-cta-inner">
          <div>
            <p className="eyebrow eyebrow-light">{t("home.ready")}</p>
            <h2 id="final-cta-title">{t("home.finalTitle")}</h2>
            <p>{t("home.finalCopy")}</p>
          </div>
          <div className="final-cta-actions">
            <Link className="button button-light" href="/book">
              {t("home.bookYourDetail")}
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
              {t("home.askWhatsapp")}
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
