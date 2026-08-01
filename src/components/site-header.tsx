"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "@/i18n/locale-provider";

const navigation = [
  { href: "/#services", key: "nav.services" },
  { href: "/#results", key: "nav.results" },
  { href: "/#process", key: "nav.process" },
  { href: "/#faq", key: "nav.faq" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations();

  return (
    <>
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>{t("announcement")}</span>
          <Link href="/contact">{t("nav.contact")}</Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            className="brand"
            href="/"
            aria-label={t("brand.home")}
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
          <nav className="desktop-nav" aria-label={t("nav.primary")}>
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
          <Link className="button button-primary header-cta" href="/book">
            {t("nav.book")}
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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
          aria-label={t("nav.mobile")}
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
                {t(item.key)}
              </Link>
            ))}
            <Link
              className="button button-primary"
              href="/book"
              onClick={() => setMenuOpen(false)}
            >
              {t("nav.bookDetail")}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
