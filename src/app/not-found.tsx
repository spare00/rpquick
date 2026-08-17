export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-display text-6xl">404</p>
      <p className="mt-3 text-muted">Listing not found.</p>
      <a href="/" className="mt-6 inline-block text-sm font-medium text-rust">
        Back to rankings
      </a>
    </main>
  );
}
