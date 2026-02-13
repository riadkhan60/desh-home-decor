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
  const reviews = [
    {
      userName: "Simran K.",
      source: "Instagram",
      rating: 5,
      comment:
        "Absolutely loved the phulkari suit I ordered. Stitching and fit were perfect, just like in the pictures.",
      image:
        "https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=800&q=80",
      screnShotReviewImage:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      userName: "Amanpreet",
      source: "Google",
      rating: 5,
      comment:
        "Fast delivery and beautiful packaging. The colours are even richer in real life.",
      image:
        "https://images.unsplash.com/photo-1552058456-adc0aabef32c?auto=format&fit=crop&w=800&q=80",
      screnShotReviewImage:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      userName: "Jasleen",
      source: "Instagram",
      rating: 4,
      comment:
        "Lehenga quality is amazing. Blouse needed a small alteration, but overall very happy.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      screnShotReviewImage:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    },
    {
      userName: "Harpreet",
      source: "WhatsApp",
      rating: 5,
      comment:
        "Customer support helped me pick the right size. Suit looked gorgeous for my sister's mehndi.",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      screnShotReviewImage:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      userName: "Navdeep",
      source: "Facebook",
      rating: 5,
      comment:
        "Fabric is very comfortable for all-day wear. Will definitely order again.",
      image:
        "https://images.unsplash.com/photo-1543746746-47ea39144684?auto=format&fit=crop&w=800&q=80",
      screnShotReviewImage:
        "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    },
    {
      userName: "Kiran",
      source: "Google",
      rating: 4,
      comment:
        "Jewellery set completed my look perfectly. Got so many compliments at the function!",
      image:
        "https://images.unsplash.com/photo-1590736969955-71c80a6eaddd?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "Manpreet",
      source: "Instagram",
      rating: 5,
      comment:
        "Loved the attention to detail on the neck and sleeves. Feels truly premium.",
      image:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "Ravneet",
      source: "WhatsApp",
      rating: 5,
      comment:
        "Ordered from Canada for my mom in Punjab, and everything arrived on time and exactly as shown.",
      image:
        "https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "Gurpreet",
      source: "Google",
      rating: 4,
      comment:
        "Daily wear cotton suit is my new favourite. Breathable and elegant.",
      image:
        "https://images.unsplash.com/photo-1581382575286-441b418a0093?auto=format&fit=crop&w=800&q=80",
    },
    {
      userName: "Sukhmani",
      source: "Instagram",
      rating: 5,
      comment:
        "Bridal lehenga exceeded my expectations. Workmanship is beautiful and heavy but still comfortable.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    },
  ] as const;

  let index = 1;
  for (const r of reviews) {
    await prisma.review.upsert({
      where: { id: `seed-showcase-review-${index}` },
      update: {
        userName: r.userName,
        source: r.source,
        rating: r.rating,
        comment: r.comment,
        image: r.image,
        isShowcase: true,
        isApproved: true,
        productId: null,
      },
      create: {
        id: `seed-showcase-review-${index}`,
        userName: r.userName,
        source: r.source,
        rating: r.rating,
        comment: r.comment,
        image: r.image,
        isShowcase: true,
        isApproved: true,
        productId: null,
      },
    });
    index += 1;
  }

  console.log("Seeded 10 showcase reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

