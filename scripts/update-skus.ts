import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

function generateSku(name: string): string {
  // Format: DHD-FullName-Without-Special-Chars
  const cleanName = name
    .trim()
    .toUpperCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');

  return `DHD-${cleanName}`;
}

async function main() {
  // Update ALL products, not just those without SKUs
  console.log('Fetching all products to update SKUs...');
  const products = await prisma.product.findMany();

  console.log(
    `Found ${products.length} products to update SKUs. Starting update...`,
  );

  let updatedCount = 0;

  for (const product of products) {
    let sku = generateSku(product.name);
    let counter = 1;
    let isUnique = false;

    // Ensure the generated SKU is completely unique
    while (!isUnique) {
      const existing = await prisma.product.findUnique({
        where: { sku },
      });

      if (!existing) {
        isUnique = true;
      } else {
        // If conflict occurs, append counter
        sku = `${generateSku(product.name)}-${counter}`;
        counter++;
      }
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { sku },
    });

    updatedCount++;
    console.log(
      `Updated [${updatedCount}/${products.length}]: ${product.name}`,
    );
    console.log(`  -> New SKU: ${sku}`);
  }

  console.log('\nAll products updated successfully!');
}

main()
  .catch((e) => {
    console.error('Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
