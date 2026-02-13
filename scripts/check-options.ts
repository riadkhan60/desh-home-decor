/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      options: true,
    },
  });

  console.log('Total products:', products.length);
  const productsWithOptions = products.filter((p: { options: string | any[]; }) => p.options.length > 0);
  console.log('Products with options:', productsWithOptions.length);

  if (productsWithOptions.length > 0) {
    console.log(
      'Sample product with options:',
      JSON.stringify(productsWithOptions[0].options, null, 2),
    );
  } else {
    console.log('No products have options.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
