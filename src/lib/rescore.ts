import { prisma } from "./prisma";
import { scoreListing } from "./scoring";

export async function rescoreAll(now = new Date()) {
  const listings = await prisma.listing.findMany({
    include: { snapshots: { orderBy: { recordedAt: "asc" } } },
  });

  const groups = new Map<string, { id: string; price: number }[]>();
  for (const listing of listings) {
    const key = `${listing.state}|${listing.suburb}|${listing.propertyType}|${listing.beds}`;
    const prices = groups.get(key) ?? [];
    prices.push({ id: listing.id, price: listing.currentPrice });
    groups.set(key, prices);
  }

  const scored = listings.map((listing) => {
    const key = `${listing.state}|${listing.suburb}|${listing.propertyType}|${listing.beds}`;
    const comparablePrices = (groups.get(key) ?? [])
      .filter((row) => row.id !== listing.id)
      .map((row) => row.price);
    const result = scoreListing({
      currentPrice: listing.currentPrice,
      listedAt: listing.listedAt,
      headline: listing.headline,
      description: listing.description,
      suburb: listing.suburb,
      propertyType: listing.propertyType,
      beds: listing.beds,
      snapshots: listing.snapshots,
      comparablePrices,
      now,
    });
    return { listingId: listing.id, result };
  });

  scored.sort((a, b) => b.result.dealScore - a.result.dealScore);

  await prisma.$transaction(
    scored.map(({ listingId, result }, index) =>
      prisma.score.upsert({
        where: { listingId },
        create: {
          listingId,
          rank: index + 1,
          ...result,
          reasons: JSON.stringify(result.reasons),
          computedAt: now,
        },
        update: {
          rank: index + 1,
          ...result,
          reasons: JSON.stringify(result.reasons),
          computedAt: now,
        },
      }),
    ),
  );

  return scored.length;
}
