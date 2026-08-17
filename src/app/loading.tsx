export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="h-12 w-2/3 animate-pulse rounded-lg bg-line" />
      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-line" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-line/70" />
        ))}
      </div>
    </main>
  );
}
