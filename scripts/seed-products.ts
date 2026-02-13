import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ProductCollection } from "../generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

async function main() {
  // Ensure a base category exists
  const category = await prisma.category.upsert({
    where: { slug: "punjabi-suits" },
    update: {},
    create: {
      name: "Punjabi Suits",
      slug: "punjabi-suits",
      description: "Signature Punjabi suits and outfits.",
      order: 1,
      isActive: true,
    },
  });

  // Generate 50 sample products with at least 10 in each collection
  const baseImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521572163474-4f4a4a2b5cfe?auto=format&fit=crop&w=1200&q=80",
  ] as const;

  const products: {
    id: string;
    name: string;
    description: string;
    price: string;
    comparePrice: string | null;
    sku: string;
    stock: number;
    categoryId: string;
    tags: string[];
    featuredImage: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
    collections: ProductCollection[];
    order: number;
  }[] = [];

  const pushProduct = (
    index: number,
    name: string,
    collections: ProductCollection[],
    basePrice: number,
  ) => {
    const img = baseImages[index % baseImages.length];
    const price = basePrice;
    const comparePrice = basePrice + 1000;
    products.push({
      id: `seed-product-${index}`,
      name,
      description: `${name} from our Punjabi collection.`,
      // Prisma Decimal: pass as string to avoid runtime Decimal issues
      price: price.toFixed(2),
      comparePrice: comparePrice.toFixed(2),
      // Avoid collisions across multiple seed runs
      sku: `SEED-SKU-${index.toString().padStart(3, "0")}`,
      stock: 5 + (index % 10),
      categoryId: category.id,
      tags: ["punjabi", "ethnic", "suit"],
      featuredImage: img,
      images: [img],
      isActive: true,
      isFeatured: index % 3 === 0,
      collections,
      order: index,
    });
  };

  // Ensure at least 10 in each collection
  for (let i = 1; i <= 10; i++) {
    pushProduct(i, `New Arrival Suit ${i}`, [ProductCollection.NEW_ARRIVAL], 3499 + (i % 5) * 500);
  }
  for (let i = 11; i <= 20; i++) {
    pushProduct(i, `Best Seller Outfit ${i}`, [ProductCollection.BEST_SELL], 4999 + (i % 5) * 700);
  }
  for (let i = 21; i <= 30; i++) {
    pushProduct(i, `Trending Lehenga ${i}`, [ProductCollection.TRENDING], 7999 + (i % 5) * 800);
  }

  // Remaining 20 spread across combos
  for (let i = 31; i <= 50; i++) {
    const combo =
      i % 3 === 0
        ? [ProductCollection.NEW_ARRIVAL, ProductCollection.BEST_SELL]
        : i % 3 === 1
          ? [ProductCollection.BEST_SELL, ProductCollection.TRENDING]
          : [ProductCollection.NEW_ARRIVAL, ProductCollection.TRENDING];
    pushProduct(i, `Mixed Collection Piece ${i}`, combo, 3999 + (i % 5) * 500);
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log("Seeded sample products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

