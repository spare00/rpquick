import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import type { NormalizedListing } from "../types";
import { rescoreAll } from "../rescore";

function listingId(listing: NormalizedListing) {
  return `${listing.source}-${listing.sourceId}`;
}

function lastReducedAt(history: NormalizedListing["priceHistory"]) {
  const sorted = [...history].sort(
    (a, b) => a.recordedAt.getTime() - b.recordedAt.getTime(),
  );
  let reduced: Date | null = null;
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].price < sorted[i - 1].price) {
      reduced = sorted[i].recordedAt;
    }
  }
  return reduced;
}

export async function ingestListings(listings: NormalizedListing[]) {
  for (const listing of listings) {
    if (!listing.currentPrice || listing.currentPrice <= 0) continue;
    const id = listingId(listing);
    const data: Prisma.ListingUncheckedCreateInput = {
      id,
      source: listing.source,
      sourceId: listing.sourceId,
      domainUrl: listing.domainUrl ?? null,
      reaUrl: listing.reaUrl ?? null,
      address: listing.address,
      suburb: listing.suburb,
      state: listing.state,
      postcode: listing.postcode,
      lat: listing.lat ?? null,
      lng: listing.lng ?? null,
      propertyType: listing.propertyType,
      beds: listing.beds,
      baths: listing.baths,
      parking: listing.parking,
      landSqm: listing.landSqm ?? null,
      floorSqm: listing.floorSqm ?? null,
      currentPrice: listing.currentPrice,
      displayPrice: listing.displayPrice,
      listedAt: listing.listedAt,
      lastSeenAt: listing.lastSeenAt,
      lastReducedAt: lastReducedAt(listing.priceHistory),
      headline: listing.headline,
      description: listing.description,
      imageUrl: listing.imageUrl,
      agentName: listing.agentName ?? null,
      agencyName: listing.agencyName ?? null,
      features: JSON.stringify(listing.features),
    };

    await prisma.listing.upsert({
      where: { id },
      create: data,
      update: data,
    });

    const existing = await prisma.priceSnapshot.findMany({
      where: { listingId: id },
      orderBy: { recordedAt: "asc" },
    });

    for (const point of listing.priceHistory) {
      const duplicate = existing.some(
        (row) =>
          row.price === point.price &&
          Math.abs(row.recordedAt.getTime() - point.recordedAt.getTime()) < 60_000,
      );
      if (duplicate) continue;
      await prisma.priceSnapshot.create({
        data: {
          listingId: id,
          price: point.price,
          recordedAt: point.recordedAt,
        },
      });
    }
  }

  await rescoreAll();
  return listings.length;
}
