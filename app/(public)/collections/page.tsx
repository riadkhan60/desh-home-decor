import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/container';
import { BanglaText } from '@/components/bangla-text';
import { getProducts } from '@/lib/actions/products-list';
import { getCollections } from '@/lib/actions/collections';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { OrderNowButton } from '@/components/order-now-button';

export const revalidate = 3600;

function formatPrice(value: string) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `TK ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any) {
  const variants = p.variants ?? [];
  const hasMultipleVariants = variants.length > 1;
  const hasVariants = variants.length > 0;
  let price: string;
  let comparePrice: string | null = null;
  let priceMin: string | null = null;
  let priceMax: string | null = null;
  let stock: number;

  if (hasMultipleVariants) {
    const prices = variants.map((v: { price: unknown }) => Number(v.price));
    priceMin = Math.min(...prices).toString();
    priceMax = Math.max(...prices).toString();
    price = priceMin;
    stock = variants.reduce((s: number, v: { stock?: number }) => s + (v.stock ?? 0), 0);
  } else if (hasVariants) {
    stock = variants.reduce((s: number, v: { stock?: number }) => s + (v.stock ?? 0), 0);
    price = (p.price ?? variants[0]?.price ?? 0).toString();
    comparePrice = p.comparePrice?.toString() ?? null;
  } else {
    stock = p.stock ?? 0;
    price = (p.price ?? 0).toString();
    comparePrice = p.comparePrice?.toString() ?? null;
  }

  return {
    id: p.id,
    name: p.name,
    price,
    comparePrice: hasMultipleVariants ? null : comparePrice,
    priceMin: hasMultipleVariants ? priceMin : null,
    priceMax: hasMultipleVariants ? priceMax : null,
    hasMultipleVariants,
    featuredImage: p.featuredImage,
    stock,
    weight: p.weight != null ? Number(p.weight) : null,
    category: p.category,
  };
}

export default async function CollectionsPage() {
  const collectionsRes = await getCollections();
  const collectionsData = (collectionsRes.success ? collectionsRes.data ?? [] : []).filter(
    (c) => c.isActive !== false
  );

  const collections = await Promise.all(
    collectionsData.map(async (c) => {
      const { products, total } = await getProducts({
        collection: c.slug,
        take: 8,
      });
      return {
        slug: c.slug,
        name: c.name,
        description: c.description || `Discover our ${c.name} collection`,
        products: products.map(mapProduct),
        total,
      };
    })
  );

  return (
    <main className="min-h-screen bg-background pb-12 pt-8">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our Collections
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our curated collections of Deshi Home Decor
          </p>
        </div>

        {collections.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No collections yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-16">
            {collections.map((collection) => (
              <section key={collection.slug} className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {collection.name}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                  <Link
                    href={`/shop?collection=${collection.slug}`}
                    className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex"
                  >
                    View all ({collection.total})
                  </Link>
                </div>

                {collection.products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                      {collection.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
                        >
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            {product.featuredImage ? (
                              <Image
                                src={product.featuredImage}
                                alt={product.name}
                                fill
                                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 50vw"
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                No image
                              </div>
                            )}
                            {product.comparePrice &&
                              Number(product.comparePrice) >
                                Number(product.price) && (
                                <div className="absolute right-3 top-3 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-white">
                                  Sale
                                </div>
                              )}
                          </div>

                          <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-2 sm:p-4">
                            <BanglaText as="h3" className="line-clamp-2 text-sm font-medium leading-tight sm:text-base">
                              {product.name}
                            </BanglaText>

                            <div className="mt-auto flex items-baseline gap-1 sm:gap-2">
                              {product.hasMultipleVariants &&
                              product.priceMin != null &&
                              product.priceMax != null ? (
                                <span className="text-base font-semibold sm:text-lg">
                                  {formatPrice(product.priceMin)} – {formatPrice(product.priceMax)}
                                </span>
                              ) : (
                                <>
                                  <span className="text-base font-semibold sm:text-lg">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.comparePrice &&
                                    Number(product.comparePrice) > Number(product.price) && (
                                      <span className="text-xs text-muted-foreground line-through sm:text-sm">
                                        {formatPrice(product.comparePrice)}
                                      </span>
                                    )}
                                </>
                              )}
                            </div>

                            <div className="mt-2 flex gap-2 sm:mt-3">
                              <AddToCartButton
                                product={{
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  featuredImage: product.featuredImage,
                                  stock: product.stock,
                                  weight: product.weight ?? null,
                                  categoryName: product.category?.name,
                                }}
                                variant="compact"
                                className="flex-1"
                              />
                              <OrderNowButton
                                product={{
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  featuredImage: product.featuredImage,
                                  stock: product.stock,
                                  weight: product.weight ?? null,
                                  categoryName: product.category?.name,
                                }}
                                variant="compact"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="flex justify-center sm:hidden">
                      <Link
                        href={`/shop?collection=${collection.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border px-6 py-2 text-sm font-medium transition hover:bg-muted"
                      >
                        View all {collection.name} ({collection.total})
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No products in this collection yet
                  </p>
                )}
              </section>
            ))}
            </div>
        )}
      </Container>
    </main>
  );
}
