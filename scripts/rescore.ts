import { rescoreAll } from "../src/lib/rescore";
import { prisma } from "../src/lib/prisma";

async function main() {
  const n = await rescoreAll();
  console.log(`Rescored ${n} listings`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
