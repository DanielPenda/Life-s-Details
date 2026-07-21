import { Menu } from "lucide-react";
import Link from "next/link";
import { businessInfo } from "@/config/business";
import { navigation } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${businessInfo.name} home`}>
          <span className="brand-mark">LD</span>
          <span>{businessInfo.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-primary header-cta" href="/book">
          Book
        </Link>
        <button className="mobile-menu-button" type="button" aria-label="Open menu">
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
