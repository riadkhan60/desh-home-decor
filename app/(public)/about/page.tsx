import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/container';

import { Leaf, Heart, Users, Package, Sparkles, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us - Deshi Home Decor',
  description:
    'Learn about Deshi Home Decor - your trusted source for eco-friendly bamboo, rattan, seagrass, jute, and premium imported home decor items.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pb-16 pt-8">
      <Container>
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About Deshi Home Decor
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Bringing nature&apos;s beauty into your home with handcrafted
            organic decor and premium imported pieces
          </p>
        </div>

        {/* Our Story */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-card p-8 sm:p-10">
            <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                At{' '}
                <span className="font-semibold text-foreground">
                  Deshi Home Decor
                </span>
                , we believe in the timeless beauty of natural materials and the
                artistry of traditional craftsmanship. We specialize in bringing
                you the finest collection of{' '}
                <span className="text-foreground">
                  bamboo, rattan, seagrass, and jute
                </span>{' '}
                home decor items – each piece telling a story of heritage and
                sustainability.
              </p>
              <p>
                Our products come directly from{' '}
                <span className="text-foreground">
                  factory sources and handcrafted village artisans
                </span>
                , ensuring authenticity and supporting local communities. We
                also curate a selection of premium imported items from China,
                combining the best of traditional and contemporary design.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            What Makes Us Different
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Factory Direct & Handcrafted
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We source directly from factories and village artisans, ensuring
                authentic organic products at unbeatable prices.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Cheapest Yet Premium
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our unique sourcing model allows us to offer the most
                competitive prices without compromising on quality or design.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Best Quality Guaranteed
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every piece is carefully selected and inspected to meet our high
                standards for durability, craftsmanship, and aesthetics.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Eco-Friendly Materials
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bamboo, rattan, seagrass, and jute – sustainable, renewable
                materials that are kind to the planet.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Global Curation
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                From local village crafts to premium Chinese imports, we bring
                you the best of both worlds.
              </p>
            </div>

            <div className="group rounded-xl border border-border bg-card p-6 transition hover:border-[#D4AF37]/40 hover:shadow-lg sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Community Support
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By choosing our handcrafted items, you support village artisans
                and their families.
              </p>
            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-green-500/20 bg-linear-to-br from-green-950/20 to-green-900/10 p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <Leaf className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Our Vision
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We envision a world where homes are filled with{' '}
              <span className="font-semibold text-foreground">
                eco-friendly, sustainable products
              </span>{' '}
              that reconnect us with nature. Our mission is to supply beautiful,
              organic home decor that not only enhances your living space but
              also encourages a return to natural, earth-conscious living.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every purchase you make is a step toward a greener planet and a
              more sustainable future.
            </p>
          </div>
        </div>

        {/* Our Team */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Our Team
          </h2>
          <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We are a dedicated team united by a passion for sustainable living
              and beautiful home design. Together, we curate, source, and
              deliver the finest eco-friendly decor to homes across Bangladesh.
            </p>
          </div>
        </div>

        {/* Our Leaders */}
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Our Leaders
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Hafizur Rahman Orko',
                title: 'Founder',
                role: ' Manages sourcing, logistics, and operations',
                image:
                  '/hafiz.jpg',
              },
              {
                name: 'Iftekhar Mahmud Alvy',
                title: 'Founder',
                role: 'Oversees overall strategy and business development',
                image:
                  '/alvy.jpg',
              },
              {
                name: 'MD Samiul Alam',
                title: 'Founder',
                role: 'Manages Tech & Other Operations',
                image:
                  '/riad.jpg',
              },
            ].map((leader) => (
              <div
                key={leader.name}
                className="overflow-hidden rounded-xl border border-border bg-card text-center transition hover:border-[#D4AF37]/40"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground">
                    {leader.name}
                  </h3>
                  <p className="mb-2 text-sm font-medium text-[#D4AF37]">
                    {leader.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Products */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Our Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Natural & Organic
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Bamboo lighting and furniture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Rattan baskets and decor pieces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Seagrass storage and accessories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Jute rugs and wall hangings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Handcrafted village products</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Premium Imports
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Contemporary Chinese home decor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Modern lighting fixtures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Designer accessories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Quality-tested imports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                  <span>Affordable luxury items</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Why Choose Us
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Unbeatable Prices, Premium Quality
                </h3>
                <p className="text-sm text-muted-foreground">
                  We offer the{' '}
                  <span className="font-medium text-foreground">
                    cheapest prices
                  </span>{' '}
                  in the market without compromising on quality. Our direct
                  sourcing model eliminates middlemen, passing the savings
                  directly to you.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Eco-Friendly & Sustainable
                </h3>
                <p className="text-sm text-muted-foreground">
                  All our natural products are made from{' '}
                  <span className="font-medium text-foreground">
                    renewable, biodegradable materials
                  </span>
                  . We&apos;re committed to reducing environmental impact and
                  promoting sustainable living.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Supporting Local Artisans
                </h3>
                <p className="text-sm text-muted-foreground">
                  By purchasing our handcrafted items, you directly support
                  village communities and help preserve traditional
                  craftsmanship for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Materials */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Materials We Work With
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Bamboo', desc: 'Strong, sustainable, versatile' },
              { name: 'Rattan', desc: 'Flexible, durable, elegant' },
              { name: 'Seagrass', desc: 'Natural, textured, eco-friendly' },
              { name: 'Jute', desc: 'Organic, rustic, biodegradable' },
              { name: 'Wicker', desc: 'Woven, lightweight, timeless' },
              { name: 'Cane', desc: 'Classic, breathable, durable' },
              { name: 'Sisal', desc: 'Rough texture, natural fiber' },
              { name: 'Coir', desc: 'Coconut fiber, sturdy, eco' },
              { name: 'Hemp', desc: 'Strong, sustainable, hypoallergenic' },
              { name: 'Palm', desc: 'Tropical, handwoven, organic' },
              { name: 'Cotton', desc: 'Soft, breathable, versatile' },
              { name: 'Linen', desc: 'Lightweight, natural, elegant' },
              { name: 'Wood', desc: 'Teak, mango, sheesham – warm & lasting' },
              { name: 'Terracotta', desc: 'Clay-fired, earthy, artisanal' },
              { name: 'Ceramic', desc: 'Glazed, decorative, handcrafted' },
              { name: 'Metal', desc: 'Brass, copper – accent pieces' },
              { name: 'Glass', desc: 'Clear, decorative, delicate' },
              { name: 'Cork', desc: 'Sustainable, sound-absorbing, unique' },
            ].map((material) => (
              <div
                key={material.name}
                className="rounded-lg border border-border bg-card p-5 text-center"
              >
                <h3 className="mb-1 font-semibold text-foreground">
                  {material.name}
                </h3>
                <p className="text-xs text-muted-foreground">{material.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-linear-to-br from-[#D4AF37]/5 to-transparent p-8 sm:p-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Transform Your Home?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Explore our collection of eco-friendly, handcrafted, and premium
              home decor items
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-3 font-medium text-black transition hover:bg-[#E5C04A]"
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D4AF37] bg-transparent px-8 py-3 font-medium text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
