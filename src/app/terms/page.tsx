import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.termsTitle"), description: t("meta.termsDescription") };
}

export default async function TermsPage() {
  const t = createTranslator(await getLocale());
  return (
    <section className="section">
      <div className="container narrow legal-copy">
        <p className="eyebrow">{t("terms.eyebrow")}</p>
        <h1>{t("terms.title")}</h1>
        <p>{t("terms.copy")}</p>
      </div>
    </section>
  );
}
