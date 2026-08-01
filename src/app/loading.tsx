"use client";

import { useTranslations } from "@/i18n/locale-provider";

export default function Loading() {
  const t = useTranslations();
  return (
    <div className="container loading-state" role="status" aria-live="polite">
      {t("loading")}
    </div>
  );
}
