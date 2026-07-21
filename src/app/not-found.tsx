import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you requested is not available.</p>
        <Link className="button button-primary" href="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
