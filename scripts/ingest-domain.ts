import { collectDomainListings } from "../src/lib/collectors/domain";
import { FOCUS_LOCATIONS_ENV } from "../src/lib/collectors/focus";
import { replaceListings } from "../src/lib/collectors/ingest";
import { prisma } from "../src/lib/prisma";

async function main() {
  const listings = await collectDomainListings({
    locations: process.env.DOMAIN_LOCATIONS || FOCUS_LOCATIONS_ENV,
  });
  if (listings.length === 0) {
    throw new Error(
      `Domain returned no priced listings for ${process.env.DOMAIN_LOCATIONS || FOCUS_LOCATIONS_ENV}.`,
    );
  }
  await replaceListings(listings);
  const count = await prisma.listing.count();
  console.log(
    `Domain ingest complete: ${listings.length} collected, ${count} stored (Rochedale + Rochedale South only)`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
