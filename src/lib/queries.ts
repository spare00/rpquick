import type { Listing, PriceSnapshot, Score } from "@prisma/client";
import { prisma } from "./prisma";

export type ListingWithScore = Listing & {
  score: Score;
  snapshots: PriceSnapshot[];
  displayRank: number;
};

export type Filters = {
  state?: string;
  propertyType?: string;
  beds?: string;
  view?: string;
  sort?: string;
  q?: string;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): Filters {
  return {
    state: first(searchParams.state),
    propertyType: first(searchParams.propertyType),
    beds: first(searchParams.beds),
    view: first(searchParams.view) ?? "hot",
    sort: first(searchParams.sort) ?? "rank",
    q: first(searchParams.q),
  };
}

export async function getRankedListings(
  filters: Filters,
): Promise<ListingWithScore[]> {
  const listings = await prisma.listing.findMany({
    where: {
      score: { isNot: null },
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
      ...(filters.beds
        ? filters.beds === "4"
          ? { beds: { gte: 4 } }
          : { beds: Number(filters.beds) }
        : {}),
      ...(filters.q
        ? {
            OR: [
              { suburb: { contains: filters.q } },
              { address: { contains: filters.q } },
            ],
          }
        : {}),
    },
    include: {
      score: true,
      snapshots: { orderBy: { recordedAt: "asc" } },
    },
  });

  const view = filters.view ?? "hot";
  let rows = listings.filter((row): row is Listing & { score: Score; snapshots: PriceSnapshot[] } =>
    Boolean(row.score),
  );

  if (view === "hot") {
    rows = rows.filter((row) => row.score.dealScore >= 38);
  } else if (view === "drop") {
    rows = rows.filter((row) => row.score.dropScore >= 28);
  } else if (view === "cheap") {
    rows = rows.filter((row) => row.score.undervalueScore >= 28);
  }

  const sort = filters.sort ?? "rank";
  rows.sort((a, b) => {
    if (sort === "drop") return b.score.dropScore - a.score.dropScore;
    if (sort === "undervalue") return b.score.undervalueScore - a.score.undervalueScore;
    if (sort === "newest") {
      const da = a.lastReducedAt ?? a.listedAt;
      const db = b.lastReducedAt ?? b.listedAt;
      return db.getTime() - da.getTime();
    }
    return a.score.rank - b.score.rank;
  });

  return rows.map((row, index) => ({ ...row, displayRank: index + 1 }));
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      score: true,
      snapshots: { orderBy: { recordedAt: "asc" } },
    },
  });
}

export async function getComparables(listing: Listing) {
  return prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      suburb: listing.suburb,
      state: listing.state,
      propertyType: listing.propertyType,
      beds: listing.beds,
    },
    include: { score: true },
    orderBy: { currentPrice: "asc" },
  });
}

export async function getHomeStats() {
  const [total, hot, avgDrop] = await Promise.all([
    prisma.listing.count(),
    prisma.score.count({ where: { dealScore: { gte: 38 } } }),
    prisma.score.aggregate({
      _avg: { drop7dPct: true },
      where: { drop7dPct: { not: null } },
    }),
  ]);
  return {
    total,
    hot,
    avgDrop7d: avgDrop._avg.drop7dPct,
  };
}
