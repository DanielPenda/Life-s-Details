import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppLifecycle } from "@/components/app-lifecycle";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessInfo } from "@/config/business";
import { localeTags } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/locale-provider";
import { getLocale } from "@/i18n/server";
import { createTranslator } from "@/i18n/translations";
import { env } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = createTranslator(locale);
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t("meta.defaultTitle"), template: "%s | Life's Details" },
    description: t("meta.defaultDescription"),
    alternates: { canonical: "/" },
    applicationName: "Life's Details",
    appleWebApp: { capable: true, statusBarStyle: "default", title: "Life's Details" },
    icons: { apple: "/icons/apple-touch-icon.png" },
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      url: "/",
      siteName: "Life's Details",
      title: t("meta.defaultTitle"),
      description: t("meta.ogDescription"),
      images: [{ url: "/og.png", width: 1731, height: 909, alt: t("meta.defaultTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.defaultTitle"),
      description: t("meta.ogDescription"),
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0f3d3e",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = createTranslator(locale);
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: businessInfo.name,
    url: env.NEXT_PUBLIC_SITE_URL,
    telephone: businessInfo.phone.e164,
    email: businessInfo.email,
    description: t("meta.defaultDescription"),
    areaServed: {
      "@type": "City",
      name: businessInfo.serviceArea.city,
      postalCode: businessInfo.serviceArea.postcode,
      addressCountry: "BE",
    },
  };
  return (
    <html lang={localeTags[locale]}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <AppLifecycle />
        </LocaleProvider>
      </body>
    </html>
  );
}
