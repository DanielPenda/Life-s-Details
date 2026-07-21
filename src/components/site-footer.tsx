import Image from "next/image";
import Link from "next/link";
import { businessInfo, contactLinks } from "@/config/business";
import { navigation } from "@/config/navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="stack">
          <Link className="brand" href="/" aria-label={`${businessInfo.name} home`}>
            <Image
              className="brand-logo brand-logo-footer"
              src="/brand/lifes-details-logo-horizontal.svg"
              alt=""
              width={560}
              height={160}
            />
          </Link>
          <p className="muted">
            Mobile car detailing in {businessInfo.serviceArea.city}{" "}
            {businessInfo.serviceArea.postcode} and nearby areas.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <address className="footer-contact">
          <a href={contactLinks.phone}>{businessInfo.phone.display}</a>
          <a href={contactLinks.email}>{businessInfo.email}</a>
          <a href={contactLinks.whatsapp}>Contact on WhatsApp</a>
        </address>
      </div>
    </footer>
  );
}
