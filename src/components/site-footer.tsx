"use client";

import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { landingPageContent } from "@/config/content";
import { useTranslations } from "@/i18n/locale-provider";
import { analyticsEvents } from "@/lib/analytics";

const navigation = [
  { href: "/#services", key: "nav.services" },
  { href: "/#results", key: "nav.results" },
  { href: "/#process", key: "nav.process" },
  { href: "/#faq", key: "nav.faq" },
] as const;

export function SiteFooter() {
  const t = useTranslations();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="stack">
          <Link className="brand" href="/" aria-label={t("brand.home")}>
            <Image
              className="brand-logo brand-logo-footer"
              src="/brand/lifes-details-logo-horizontal-footer.svg"
              alt=""
              width={560}
              height={160}
            />
          </Link>
          <p className="muted">
            {t("footer.description")}
          </p>
          {landingPageContent.socialLinks.length > 0 ? (
            <div className="footer-socials">
              {landingPageContent.socialLinks.map((social) => (
                <a href={social.href} key={social.href}>
                  {social.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="muted footer-pending">{t("footer.socialPending")}</p>
          )}
        </div>
        <nav className="footer-links" aria-label={t("footer.navigation")}>
          <span className="footer-label">{t("footer.explore")}</span>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {t(item.key)}
            </Link>
          ))}
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
        </nav>
        <address className="footer-contact">
          <span className="footer-label">{t("footer.contact")}</span>
          <TrackedLink
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "phone", placement: "footer" }}
            href={contactLinks.phone}
          >
            {businessInfo.phone.display}
          </TrackedLink>
          <TrackedLink
            event={analyticsEvents.contactClick}
            eventProperties={{ method: "email", placement: "footer" }}
            href={contactLinks.email}
          >
            {businessInfo.email}
          </TrackedLink>
          <TrackedLink
            event={analyticsEvents.whatsappClick}
            eventProperties={{ placement: "footer" }}
            href={contactLinks.whatsapp}
            target="_blank"
          >
            {t("footer.whatsapp")}
          </TrackedLink>
        </address>
        <p className="footer-legal-note">{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
