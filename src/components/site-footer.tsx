import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";
import { businessInfo, contactLinks } from "@/config/business";
import { landingPageContent } from "@/config/content";
import { navigation } from "@/config/navigation";
import { analyticsEvents } from "@/lib/analytics";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="stack">
          <Link className="brand" href="/" aria-label={`${businessInfo.name} home`}>
            <Image
              className="brand-logo brand-logo-footer"
              src="/brand/lifes-details-logo-horizontal-footer.svg"
              alt=""
              width={560}
              height={160}
            />
          </Link>
          <p className="muted">
            Mobile car detailing in {businessInfo.serviceArea.city}{" "}
            {businessInfo.serviceArea.postcode} and nearby areas.
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
            <p className="muted footer-pending">Social profile links pending.</p>
          )}
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <span className="footer-label">Explore</span>
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <address className="footer-contact">
          <span className="footer-label">Contact</span>
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
            Contact on WhatsApp
          </TrackedLink>
        </address>
        <p className="footer-legal-note">{landingPageContent.legalBusinessInfo}</p>
      </div>
    </footer>
  );
}
