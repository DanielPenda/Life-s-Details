import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const t = createTranslator(await getLocale());
  return { title: t("meta.privacyTitle"), description: t("meta.privacyDescription") };
}

export default async function PrivacyPage() {
  const t = createTranslator(await getLocale());
  return (
    <section className="section">
      <div className="container narrow legal-copy">
        <p className="eyebrow">{t("privacy.eyebrow")}</p>
        <h1>{t("privacy.title")}</h1>
        <p>{t("privacy.intro")}</p>
        <h2>{t("privacy.collectTitle")}</h2>
        <p>{t("privacy.collectCopy")}</p>
        <h2>{t("privacy.whyTitle")}</h2>
        <p>{t("privacy.whyCopy")}</p>
        <h2>{t("privacy.storageTitle")}</h2>
        <p>{t("privacy.storageCopy")}</p>
        <h2>{t("privacy.choicesTitle")}</h2>
        <p>
          {t("privacy.choicesCopy")} <a href="mailto:info.lifesdetails@gmail.com">info.lifesdetails@gmail.com</a>. {t("privacy.choicesAfter")}
        </p>
        <p>{t("privacy.review")}</p>
      </div>
    </section>
  );
}
