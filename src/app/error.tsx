"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container narrow stack">
        <p className="eyebrow">Something went wrong</p>
        <h1>We could not load this page.</h1>
        <button className="button button-primary" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </section>
  );
}
