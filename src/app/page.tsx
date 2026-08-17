import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { formatPct } from "@/lib/format";
import { getHomeStats, getRankedListings, parseFilters } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const [listings, stats] = await Promise.all([
    getRankedListings(filters),
    getHomeStats(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="mb-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-rust uppercase">
            Australia bargain radar
          </p>
          <h1 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
            Rank distressed listings first.
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            We score homes that have been cut hard in recent days or weeks, or sit well below
            similar local listings. Open a listing for source links and the rank rationale.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3">
          <Stat label="Watched" value={String(stats.total)} />
          <Stat label="Distressed & cheap" value={String(stats.hot)} />
          <Stat
            label="Avg 7-day drop"
            value={stats.avgDrop7d ? formatPct(-stats.avgDrop7d) : "—"}
          />
        </dl>
      </section>

      <FilterBar filters={filters} />

      <p className="mt-6 mb-3 text-sm text-muted">
        {listings.length} listings · default sort is deal score (drop + undervalue + distress)
      </p>

      <div className="space-y-3">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
            <p className="font-medium">No listings match these filters.</p>
            <p className="mt-2 text-sm text-muted">
              Widen the filters or run <code className="rounded bg-line px-1">npm run db:setup</code>{" "}
              to load sample data.
            </p>
          </div>
        ) : (
          listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-4">
      <dt className="text-[11px] tracking-wide text-muted uppercase">{label}</dt>
      <dd className="font-display mt-1 text-2xl">{value}</dd>
    </div>
  );
}
