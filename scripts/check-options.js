// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      include: {
        options: true,
      },
    });

    console.log('Total products:', products.length);
    const productsWithOptions = products.filter(
      (p) => p.options && p.options.length > 0,
    );
    console.log('Products with options:', productsWithOptions.length);

    if (productsWithOptions.length > 0) {
      console.log('Sample product with options:');
      productsWithOptions.forEach((p) => {
        console.log(`Product: ${p.name} (ID: ${p.id})`);
        console.log('Options:', JSON.stringify(p.options, null, 2));
      });
    } else {
      console.log('No products have options.');
    }
  } catch (e) {
    console.error('Error checking options:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
