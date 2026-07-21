import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Protected admin placeholder for Life's Details.",
};

export default function AdminPage() {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">Admin</p>
        <h1>Admin area placeholder</h1>
        <p className="muted">
          This route is reserved for a future protected dashboard. Authentication
          and booking management are intentionally out of scope for Phase 0.
        </p>
      </div>
    </section>
  );
}
