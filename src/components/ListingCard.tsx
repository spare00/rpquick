import Image from "next/image";
import Link from "next/link";
import { BadgeRow, listingBadges } from "@/components/Badges";
import { ScoreBar } from "@/components/ScoreBar";
import { Sparkline } from "@/components/Sparkline";
import { formatAud, formatPct, propertyTypeLabel } from "@/lib/format";
import type { ListingWithScore } from "@/lib/queries";

export function ListingCard({ listing }: { listing: ListingWithScore }) {
  const { score } = listing;
  const badges = listingBadges(score);
  const prices = listing.snapshots.map((row) => row.price);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group grid gap-4 rounded-2xl border border-line bg-card p-4 transition hover:border-ink/30 hover:shadow-[0_12px_40px_rgba(28,22,16,0.08)] md:grid-cols-[auto_180px_1fr_220px] md:items-center"
    >
      <div className="font-display text-4xl leading-none text-ink/80 md:w-16">
        {listing.displayRank}
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-line">
        <Image
          src={listing.imageUrl}
          alt={listing.address}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="180px"
        />
      </div>
      <div className="min-w-0 space-y-2">
        <BadgeRow badges={badges} />
        <div>
          <h2 className="truncate text-lg font-semibold tracking-tight">{listing.address}</h2>
          <p className="text-sm text-muted">
            {listing.suburb}, {listing.state} {listing.postcode} · {listing.beds} bed ·{" "}
            {listing.baths} bath · {propertyTypeLabel(listing.propertyType)}
          </p>
        </div>
        <p className="line-clamp-1 text-sm text-ink/80">{listing.headline}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-display text-xl">{formatAud(listing.currentPrice)}</span>
          {score.drop7dPct != null && score.drop7dPct > 0 && (
            <span className="font-medium text-rust">7d {formatPct(-score.drop7dPct)}</span>
          )}
          {score.vsCompPct != null && score.vsCompPct > 0 && (
            <span className="font-medium text-sage">{formatPct(-score.vsCompPct)} vs median</span>
          )}
          <Sparkline values={prices} />
        </div>
      </div>
      <div className="space-y-3">
        <ScoreBar label="Deal" value={score.dealScore} tone="ink" />
        <ScoreBar label="Distress" value={score.urgencyScore} tone="rust" />
        <ScoreBar label="Undervalue" value={score.undervalueScore} tone="sage" />
        <p className="text-right text-[11px] text-muted">Overall rank #{score.rank}</p>
      </div>
    </Link>
  );
}
