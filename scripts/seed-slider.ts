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
  const slides = [
    {
      id: "seed-hero-1",
      title: "New Arrivals – Punjabi Suits",
      description: "Fresh phulkari and handworked suits for the festive season.",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      link: "#",
      buttonText: "Shop New Arrivals",
      order: 1,
      isActive: true,
    },
    {
      id: "seed-hero-2",
      title: "Wedding Season Essentials",
      description: "Lehengas, shararas, and jewelry curated for big days.",
      image:
        "https://images.unsplash.com/photo-1521572163474-4f4a4a2b5cfe?auto=format&fit=crop&w=1200&q=80",
      link: "#",
      buttonText: "Explore Wedding Edit",
      order: 2,
      isActive: true,
    },
  ] as const;

  for (const slide of slides) {
    await prisma.sliderContent.upsert({
      where: { id: slide.id },
      update: slide,
      create: slide,
    });
  }

  console.log("Seeded hero SliderContent slides.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

