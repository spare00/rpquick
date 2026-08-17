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
            급매 확실성이 높은 매물부터
            <br />
            랭킹으로 보여줍니다.
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            며칠·몇 주 사이 가격을 크게 내린 매물, 같은 지역·같은 스펙 평균보다 싼 매물을
            모아 점수를 매깁니다. 상세 화면에서 원문 사이트와 랭크 근거를 확인하세요.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3">
          <Stat label="감시 매물" value={String(stats.total)} />
          <Stat label="급매·저평가" value={String(stats.hot)} />
          <Stat
            label="평균 7일 하락"
            value={stats.avgDrop7d ? formatPct(-stats.avgDrop7d) : "—"}
          />
        </dl>
      </section>

      <FilterBar filters={filters} />

      <p className="mt-6 mb-3 text-sm text-muted">
        {listings.length}건 · 기본 정렬은 종합 점수(하락 + 저평가 + 급매 신호)
      </p>

      <div className="space-y-3">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
            <p className="font-medium">조건에 맞는 매물이 없습니다.</p>
            <p className="mt-2 text-sm text-muted">
              필터를 넓히거나 <code className="rounded bg-line px-1">npm run db:setup</code> 으로
              샘플 데이터를 넣으세요.
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
