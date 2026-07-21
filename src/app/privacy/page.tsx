import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice placeholder for Life's Details.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container narrow legal-copy">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy notice placeholder</h1>
        <p>
          This page will describe how Life&apos;s Details uses contact and booking
          information. It must be reviewed before production launch.
        </p>
      </div>
    </section>
  );
}
