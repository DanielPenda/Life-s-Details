"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { localeCookieName, parseLocale } from "@/i18n/config";
import { useLocale, useTranslations } from "@/i18n/locale-provider";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="language-switcher" title={t("language.label")}>
      <Languages aria-hidden="true" size={17} />
      <span className="sr-only">{t("language.label")}</span>
      <select
        aria-label={t("language.label")}
        disabled={pending}
        onChange={(event) => {
          const nextLocale = parseLocale(event.target.value);
          if (!nextLocale) return;
          const secure = window.location.protocol === "https:" ? "; Secure" : "";
          document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
          startTransition(() => router.refresh());
        }}
        value={locale}
      >
        <option value="nl">NL</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
    </label>
  );
}
