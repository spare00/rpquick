import { ingestListings } from "../src/lib/collectors/ingest";
import { buildSeedListings } from "../src/lib/collectors/seed-listings";
import { prisma } from "../src/lib/prisma";

async function main() {
  const listings = buildSeedListings();
  await ingestListings(listings);
  const count = await prisma.listing.count();
  const scored = await prisma.score.count();
  console.log(`Seed complete: ${listings.length} ingested, ${count} listings, ${scored} scores`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
