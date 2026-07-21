import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessInfo } from "@/config/business";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Life's Details | Mobile Car Detailing in Aalter",
    template: "%s | Life's Details",
  },
  description:
    "Mobile interior and exterior car detailing in Aalter and nearby areas, with clear packages and direct booking support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_BE",
    url: "/",
    siteName: "Life's Details",
    title: "Life's Details | Mobile Car Detailing in Aalter",
    description:
      "Thoughtful mobile car detailing in Aalter and nearby areas. Compare packages and start your enquiry directly.",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Life's Details mobile car detailing in Aalter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life's Details | Mobile Car Detailing in Aalter",
    description:
      "Thoughtful mobile car detailing in Aalter and nearby areas.",
    images: ["/og.png"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: businessInfo.name,
  url: env.NEXT_PUBLIC_SITE_URL,
  telephone: businessInfo.phone.e164,
  email: businessInfo.email,
  description: "Mobile interior and exterior car detailing in Aalter and nearby areas.",
  areaServed: {
    "@type": "City",
    name: businessInfo.serviceArea.city,
    postalCode: businessInfo.serviceArea.postcode,
    addressCountry: "BE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-BE">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
