'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BanglaText } from '@/components/bangla-text';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { OrderNowButton } from '@/components/order-now-button';

interface Product {
  id: string;
  name: string;
  price: string;
  comparePrice: string | null;
  priceMin?: string | null;
  priceMax?: string | null;
  hasMultipleVariants?: boolean;
  featuredImage: string | null;
  stock: number;
  weight?: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductsGridProps {
  initialProducts: Product[];
  initialTotal: number;
  initialHasMore: boolean;
}

function formatPrice(value: string) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `TK ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function ProductsGrid({
  initialProducts,
  initialTotal,
  initialHasMore,
}: ProductsGridProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset products when filters change
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
  }, [searchParams, initialProducts, initialHasMore]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('skip', products.length.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          void loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, products.length]);

  if (!products.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No products found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {initialTotal} products
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-900 to-black transition-all duration-700 ease-out hover:-translate-y-0.5 hover:border-zinc-600"
          >
            {/* Animated Gold Border */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl p-[2px]">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#F4E4C1] to-[#D4AF37] opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" />
              <div className="relative h-full w-full rounded-2xl bg-linear-to-br from-zinc-900 to-black" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col">
              <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-zinc-800">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
              {!product.hasMultipleVariants &&
                product.comparePrice &&
                Number(product.comparePrice) > Number(product.price) && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#D4AF37] px-2 py-1 text-xs font-semibold text-black shadow-lg">
                    Sale
                  </div>
                )}
            </div>

              <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-2 sm:p-4">
              <BanglaText as="h3" className="line-clamp-2 text-sm font-medium leading-tight text-white sm:text-base group-hover:text-[#D4AF37] transition-colors duration-300">
                {product.name}
              </BanglaText>

              <div className="mt-auto flex items-baseline gap-1 sm:gap-2">
                {product.hasMultipleVariants && product.priceMin && product.priceMax ? (
                  <span className="text-base font-semibold text-[#D4AF37] sm:text-lg">
                    {formatPrice(product.priceMin)} - {formatPrice(product.priceMax)}
                  </span>
                ) : (
                  <>
                    <span className="text-base font-semibold text-[#D4AF37] sm:text-lg">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice &&
                      Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-xs text-gray-500 line-through sm:text-sm">
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
            </div>

            {/* Hover Glow Effect */}
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-linear-to-r from-[#D4AF37]/20 via-[#F4E4C1]/20 to-[#D4AF37]/20 blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Loading more products...
            </div>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  );
}
