import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeRow, listingBadges } from "@/components/Badges";
import { PriceChart } from "@/components/PriceChart";
import { ScoreBar } from "@/components/ScoreBar";
import { SourceLinks } from "@/components/SourceLinks";
import { formatAud, formatDate, formatPct, propertyTypeLabel } from "@/lib/format";
import { getComparables, getListingById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing?.score) notFound();

  const score = listing.score;
  const comparables = await getComparables(listing);
  const reasons = JSON.parse(score.reasons) as string[];
  const features = JSON.parse(listing.features) as string[];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Back to rankings
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-line">
            <Image
              src={listing.imageUrl}
              alt={listing.address}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 font-display text-lg">
              #{score.rank}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <BadgeRow badges={listingBadges(score)} />
            <h1 className="font-display text-4xl tracking-tight">{listing.address}</h1>
            <p className="text-muted">
              {listing.suburb}, {listing.state} {listing.postcode} · {listing.beds} bed ·{" "}
              {listing.baths} bath · {listing.parking} car · {propertyTypeLabel(listing.propertyType)}
              {listing.landSqm ? ` · ${listing.landSqm}㎡ land` : ""}
              {listing.floorSqm ? ` · ${listing.floorSqm}㎡ floor` : ""}
            </p>
            <p className="text-lg">{listing.headline}</p>
            <div className="flex flex-wrap items-end gap-4">
              <p className="font-display text-4xl">{formatAud(listing.currentPrice)}</p>
              {score.drop7dPct ? (
                <p className="font-medium text-rust">7d {formatPct(-score.drop7dPct)}</p>
              ) : null}
              {score.vsCompPct && score.vsCompPct > 0 ? (
                <p className="font-medium text-sage">
                  {formatPct(-score.vsCompPct)} vs median
                </p>
              ) : null}
            </div>
            <SourceLinks
              domainUrl={listing.domainUrl}
              reaUrl={listing.reaUrl}
              address={listing.address}
              suburb={listing.suburb}
              state={listing.state}
              lat={listing.lat}
              lng={listing.lng}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-line bg-card p-5">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Rank data</h2>
            <p className="font-display mt-2 text-5xl">{Math.round(score.dealScore)}</p>
            <p className="text-sm text-muted">Deal score · #{score.rank} overall</p>
            <div className="mt-5 space-y-4">
              <ScoreBar label="Price drop" value={score.dropScore} tone="gold" />
              <ScoreBar label="Undervalue" value={score.undervalueScore} tone="sage" />
              <ScoreBar label="Distress" value={score.urgencyScore} tone="rust" />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Metric label="7-day drop" value={formatPct(score.drop7dPct != null ? -score.drop7dPct : null)} />
              <Metric label="14-day drop" value={formatPct(score.drop14dPct != null ? -score.drop14dPct : null)} />
              <Metric label="30-day drop" value={formatPct(score.drop30dPct != null ? -score.drop30dPct : null)} />
              <Metric label="Reductions" value={String(score.reductionCount)} />
              <Metric label="Days on market" value={`${score.daysOnMarket} days`} />
              <Metric label="Comps" value={String(score.compCount)} />
              <Metric label="Comp median" value={formatAud(score.compMedian)} />
              <Metric
                label="Vs median"
                value={formatPct(score.vsCompPct != null ? -score.vsCompPct : null)}
              />
            </dl>
          </div>
          <div className="rounded-3xl border border-line bg-card p-5">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Why it ranks</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {reasons.length === 0 ? (
                <li className="text-muted">No strong distress or undervalue signals yet.</li>
              ) : (
                reasons.map((reason) => (
                  <li key={reason} className="border-b border-line/80 py-2 last:border-0">
                    {reason}
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>

      <section className="mt-10 rounded-3xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">Price history</h2>
        <p className="mb-4 text-sm text-muted">
          Listed {formatDate(listing.listedAt)}
          {listing.lastReducedAt ? ` · last reduced ${formatDate(listing.lastReducedAt)}` : ""}
          {listing.agencyName ? ` · ${listing.agencyName}` : ""}
        </p>
        <PriceChart snapshots={listing.snapshots} />
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">Listing description</h2>
          <p className="mt-3 text-sm leading-7 text-ink/90">{listing.description}</p>
          {features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span key={feature} className="rounded-full bg-paper px-3 py-1 text-xs text-muted">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">
            {listing.suburb} {listing.beds}-bed {propertyTypeLabel(listing.propertyType)} comps
          </h2>
          <p className="mt-1 text-sm text-muted">Current asking prices for the same suburb and spec</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-2 font-medium">Address</th>
                  <th className="pb-2 font-medium">Ask</th>
                  <th className="pb-2 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-rust-soft/50">
                  <td className="py-2 font-medium">This listing</td>
                  <td>{formatAud(listing.currentPrice)}</td>
                  <td>—</td>
                </tr>
                {comparables.map((comp) => {
                  const delta = comp.currentPrice - listing.currentPrice;
                  return (
                    <tr key={comp.id} className="border-t border-line">
                      <td className="py-2">
                        <Link href={`/listing/${comp.id}`} className="hover:text-rust">
                          {comp.address}
                        </Link>
                      </td>
                      <td>{formatAud(comp.currentPrice)}</td>
                      <td className={delta > 0 ? "text-sage" : "text-rust"}>
                        {delta === 0 ? "Same" : formatAud(delta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-2">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
