"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/locale-provider";

export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">404</p>
        <h1>{t("error.notFound")}</h1>
        <p className="muted">{t("error.notFoundCopy")}</p>
        <Link className="button button-primary" href="/">
          {t("error.returnHome")}
        </Link>
      </div>
    </section>
  );
}
