import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

async function main() {
  const cats = [
    {
      slug: "punjabi-suits",
      name: "Punjabi Suits",
      description: "Signature suits with phulkari, handwork and rich fabrics.",
      order: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "bridal-lehengas",
      name: "Bridal Lehengas",
      description: "Heavy bridal lehengas curated for wedding day and reception.",
      order: 2,
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "party-anarkalis",
      name: "Party Anarkalis",
      description: "Flowy anarkalis for sangeet, cocktails and evening parties.",
      order: 3,
      image:
        "https://images.unsplash.com/photo-1521572163474-4f4a4a2b5cfe?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "daily-wear",
      name: "Daily Wear",
      description: "Comfortable cotton suits and kurtas for everyday wear.",
      order: 4,
      image:
        "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "jewellery",
      name: "Jewellery",
      description: "Earrings, bangles and sets to complete your Punjabi look.",
      order: 5,
      image:
        "https://images.unsplash.com/photo-1590736969955-71c80a6eaddd?auto=format&fit=crop&w=1200&q=80",
    },
  ] as const;

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
        isActive: true,
        image: cat.image,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        isActive: true,
        image: cat.image,
      },
    });
  }

  console.log("Seeded categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

