import { collectDomainListings } from "../src/lib/collectors/domain";
import { ingestListings } from "../src/lib/collectors/ingest";
import { prisma } from "../src/lib/prisma";

async function main() {
  const listings = await collectDomainListings();
  await ingestListings(listings);
  console.log(`Domain ingest complete: ${listings.length} listings with a numeric price`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
