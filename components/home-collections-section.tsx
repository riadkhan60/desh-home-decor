/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomeCollectionsTabs } from '@/components/home-collections-tabs';

export type ProductCard = {
  id: string;
  name: string;
  slug?: string;
  featuredImage: string | null;
  price: string;
  priceMin?: string | null;
  priceMax?: string | null;
  hasMultipleVariants?: boolean;
  categoryName: string | null;
};

function mapProducts(items: any[]): ProductCard[] {
  return items.map((p) => {
    const variants = p.variants ?? [];
    const hasMultipleVariants = variants.length > 1;
    const hasVariants = variants.length > 0;
    let price: string;
    let priceMin: string | null = null;
    let priceMax: string | null = null;

    if (hasMultipleVariants) {
      const prices = variants.map((v: { price: any }) => Number(v.price));
      priceMin = Math.min(...prices).toString();
      priceMax = Math.max(...prices).toString();
      price = priceMin;
    } else if (hasVariants) {
      price = (p.price ?? variants[0]?.price ?? 0).toString();
    } else {
      price = (p.price ?? 0).toString();
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug || undefined,
      featuredImage: p.featuredImage,
      price,
      priceMin: hasMultipleVariants ? priceMin : null,
      priceMax: hasMultipleVariants ? priceMax : null,
      hasMultipleVariants,
      categoryName: p.category?.name ?? null,
    };
  });
}

type CollectionWithProducts = {
  slug: string;
  name: string;
  products: any[];
};

export default function HomeCollectionsSection({
  collectionsWithProducts,
}: {
  collectionsWithProducts: CollectionWithProducts[];
}) {
  if (!collectionsWithProducts?.length) {
    return null;
  }

  const collectionsWithMappedProducts = collectionsWithProducts.map((c) => ({
    slug: c.slug,
    name: c.name,
    products: mapProducts(c.products ?? []),
  }));

  return <HomeCollectionsTabs collections={collectionsWithMappedProducts} />;
}
