import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms placeholder for Life's Details.",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container narrow legal-copy">
        <p className="eyebrow">Terms</p>
        <h1>Terms placeholder</h1>
        <p>
          This page will cover booking, cancellation, weather, access, and
          payment expectations. It must be reviewed before production launch.
        </p>
      </div>
    </section>
  );
}
