import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/container';
import { BanglaText } from '@/components/bangla-text';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { ProductReviews } from '@/components/product-reviews';
import { ProductDetailActions } from '@/components/product-detail-actions';
import {
  getProductById,
  getProductReviews,
  getRelatedProducts,
} from '@/lib/actions/product-detail';
import { prisma } from '@/lib/prisma';

import type { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 3600;

// Dynamic Metadata Generation
export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found | Shilpini',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | Shilpini`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.name} at Shilpini. Authentic Punjabi ethnic wear.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.featuredImage
        ? [product.featuredImage, ...previousImages]
        : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.featuredImage ? [product.featuredImage] : [],
    },
  };
}

// Pre-generate product pages at build time for better performance
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true },
    take: 50, // Pre-generate top 50 products
  });

  return products.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(value: string) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `TK ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([
    getProductById(id),
    getProductReviews(id),
  ]);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId ?? null,
    product.id,
    8,
  );

  const activeVariants = (product.variants ?? []).filter((v) => v.isActive);
  const hasVariants = activeVariants.length > 0;
  const totalStock = hasVariants
    ? activeVariants.reduce((s, v) => s + v.stock, 0)
    : (product.stock ?? 0);
  const basePrice = product.price != null ? Number(product.price) : null;
  const variantPrices = activeVariants.map((v) => Number(v.price));
  const minVariantPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : null;
  const maxVariantPrice =
    variantPrices.length > 0 ? Math.max(...variantPrices) : null;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.featuredImage ? [product.featuredImage] : product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Shilpini',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shilpini.com'}/product/${product.id}`,
      priceCurrency: 'BDT',
      price: basePrice ?? minVariantPrice ?? 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        totalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Shilpini',
      },
    },
    aggregateRating:
      reviews.length > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue:
              reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
              reviews.length,
            reviewCount: reviews.length,
          }
        : undefined,
  };

  const images = product.featuredImage
    ? [product.featuredImage, ...product.images]
    : product.images;

  const displayPrice = hasVariants
    ? minVariantPrice != null
      ? minVariantPrice === maxVariantPrice
        ? minVariantPrice
        : null
      : basePrice
    : basePrice;
  const showPriceRange =
    hasVariants && minVariantPrice != null && maxVariantPrice != null && minVariantPrice !== maxVariantPrice;

  const discount =
    !hasVariants &&
    product.comparePrice &&
    basePrice != null &&
    Number(product.comparePrice) > basePrice
      ? Math.round(
          ((Number(product.comparePrice) - basePrice) /
            Number(product.comparePrice)) *
            100,
        )
      : null;

  return (
    <main className="min-h-screen bg-background pb-12 pt-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.id}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <BanglaText as="span" className="text-foreground">
            {product.name}
          </BanglaText>
        </nav>

        {/* Product Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <BanglaText as="h1" className="text-3xl font-medium tracking-tight sm:text-4xl text-foreground/90">
                {product.name}
              </BanglaText>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {showPriceRange ? (
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatPrice(String(minVariantPrice))} - {formatPrice(String(maxVariantPrice))}
                </span>
              ) : displayPrice != null ? (
                <>
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {hasVariants && minVariantPrice != null
                      ? `From ${formatPrice(String(minVariantPrice))}`
                      : formatPrice(String(displayPrice))}
                  </span>
                  {!hasVariants &&
                    product.comparePrice &&
                    basePrice != null &&
                    Number(product.comparePrice) > basePrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(product.comparePrice.toString())}
                        </span>
                        {discount != null && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {discount}% OFF
                          </span>
                        )}
                      </>
                    )}
                </>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6">
              <ProductDetailActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: (basePrice ?? minVariantPrice ?? 0).toString(),
                  featuredImage: product.featuredImage,
                  stock: totalStock,
                  stockShow: product.stockShow ?? false,
                  weight: product.weight != null ? Number(product.weight) : null,
                  categoryName: product.category?.name,
                  options: product.options,
                  variants: activeVariants.map((v) => ({
                    id: v.id,
                    label: v.label,
                    price: v.price.toString(),
                    comparePrice: v.comparePrice?.toString() || '',
                    stock: v.stock,
                  })),
                }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">Description</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <BanglaText as="p" className="leading-relaxed text-muted-foreground whitespace-pre-line">
                {product.description}
              </BanglaText>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
            <ProductReviews reviews={reviews} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {relatedProducts.map((rp) => {
                const variants = rp.variants ?? [];
                const hasMultipleVariants = variants.length > 1;
                const hasVariants = variants.length > 0;
                let displayPrice: string;
                if (hasMultipleVariants) {
                  const prices = variants.map((v) => Number(v.price));
                  const priceMin = Math.min(...prices);
                  const priceMax = Math.max(...prices);
                  displayPrice =
                    priceMin === priceMax
                      ? formatPrice(String(priceMin))
                      : `${formatPrice(String(priceMin))} - ${formatPrice(String(priceMax))}`;
                } else if (hasVariants) {
                  displayPrice = formatPrice(
                    (rp.price ?? variants[0]?.price ?? 0).toString(),
                  );
                } else {
                  displayPrice = formatPrice((rp.price ?? 0).toString());
                }
                return (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.id}`}
                    className="group rounded-xl border bg-card p-3 transition hover:shadow-md"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                      {rp.featuredImage ? (
                        <Image
                          src={rp.featuredImage}
                          alt={rp.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width:1024px) 25vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {rp.category && (
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {rp.category.name}
                        </p>
                      )}
                      <BanglaText as="p" className="line-clamp-2 text-sm font-medium">
                        {rp.name}
                      </BanglaText>
                      <p className="text-sm font-semibold text-foreground">
                        {displayPrice}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
