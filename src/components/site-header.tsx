"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { businessInfo } from "@/config/business";
import { landingPageContent } from "@/config/content";
import { navigation } from "@/config/navigation";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>{landingPageContent.announcement}</span>
          <Link href="/contact">Contact us</Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            className="brand"
            href="/"
            aria-label={`${businessInfo.name} home`}
            onClick={() => setMenuOpen(false)}
          >
            <Image
              className="brand-logo brand-logo-header"
              src="/brand/lifes-details-logo-horizontal.svg"
              alt=""
              width={560}
              height={160}
              priority
            />
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
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="mobile-menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mobile-nav"
          hidden={!menuOpen}
          id="mobile-navigation"
        >
          <div className="container mobile-nav-inner">
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="button button-primary"
              href="/book"
              onClick={() => setMenuOpen(false)}
            >
              Book a Detail
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
