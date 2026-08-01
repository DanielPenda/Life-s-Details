"use client";

import { useTranslations } from "@/i18n/locale-provider";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">{t("error.eyebrow")}</p>
        <h1>{t("error.title")}</h1>
        <button className="button button-primary" onClick={reset} type="button">
          {t("error.retry")}
        </button>
      </div>
    </section>
  );
}
