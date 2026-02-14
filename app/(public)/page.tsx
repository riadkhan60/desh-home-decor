import { HeroSlider } from '@/components/hero-slider';
import { Container } from '@/components/container';
import { ProductsGrid } from '@/components/products-grid';
import { CollectionFilter } from '@/components/collection-filter';
import HomeShowcaseReviewsSection from '@/components/home-showcase-reviews-section';
import HomeCategoriesSection from '@/components/home-categories-section';
import HomeCollectionsSection from '@/components/home-collections-section';
import { getHeroSlides } from '@/lib/actions/sliders';
import { getProducts, getProductsCached, getAllCategoriesCached } from '@/lib/actions/products-list';
import { getCollectionsCached } from '@/lib/actions/collections';
import { getHomeCollectionProductsCached } from '@/lib/actions/products';
import { getHomeCategoriesCached } from '@/lib/actions/categories';
import { getShowcaseReviews } from '@/lib/actions/reviews';

// Revalidate this page every 1 hour (ISR)
export const revalidate = 3600;

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    search?: string;
    sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc';
    skip?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { category, collection, search, sort, skip } = params;

  const hasFilters = !!(category || collection || search || (skip && parseInt(skip) > 0));
  const sortBy = sort || 'newest';
  const skipNum = skip ? parseInt(skip) : 0;

  const [slides, productsData, collectionsRes, categories, homeCollectionsData, homeCategories, showcaseReviews] =
    await Promise.all([
      getHeroSlides(),
      hasFilters
        ? getProducts({
            categoryId: category,
            collection,
            search,
            sortBy,
            skip: skipNum,
            take: 20,
          })
        : getProductsCached(),
      getCollectionsCached(),
      getAllCategoriesCached(),
      getHomeCollectionProductsCached(),
      getHomeCategoriesCached(),
      getShowcaseReviews(10),
    ]);

  const collections = collectionsRes.success ? collectionsRes.data : [];

  const mappedProducts = productsData.products.map((p) => {
    const variants = p.variants ?? [];
    const hasMultipleVariants = variants.length > 1;
    const hasVariants = variants.length > 0;
    let price: string;
    let comparePrice: string | null = null;
    let priceMin: string | null = null;
    let priceMax: string | null = null;
    let stock: number;

    if (hasMultipleVariants) {
      const prices = variants.map((v) => Number(v.price));
      priceMin = Math.min(...prices).toString();
      priceMax = Math.max(...prices).toString();
      price = priceMin;
      stock = variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
    } else if (hasVariants) {
      stock = variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
      price = (p.price ?? variants[0]?.price ?? 0).toString();
      comparePrice = p.comparePrice?.toString() ?? null;
    } else {
      stock = p.stock ?? 0;
      const basePrice = p.price ?? 0;
      price = basePrice.toString();
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
      category: p.category,
    };
  });

  return (
    <main className="min-h-screen bg-black text-foreground">
      <HeroSlider slides={slides} />

      {/* Products Section */}
      <section className="md:py-12 py-8 bg-black">
        <Container>
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="h-px w-8 sm:w-16 bg-linear-to-r from-transparent to-[#D4AF37]" />
              <span className="mx-3 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">
                Best Collection
              </span>
              <div className="h-px w-8 sm:w-16 bg-linear-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Home Decor &amp; Lighting
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-400">
              Discover our curated Deshi Home Decor pieces crafted to add warm,
              luxurious ambiance to your space.
            </p>
          </div>

          {/* Collection Filter */}
          <div className="mb-6">
            <CollectionFilter
              collections={(collections ?? []).map((c) => ({
                value: c.slug,
                label: c.name,
              }))}
              categories={(categories ?? []).map((cat) => ({
                id: cat.id,
                name: cat.name,
              }))}
            />
          </div>

          {/* Products Grid */}
          <ProductsGrid
            initialProducts={mappedProducts}
            initialTotal={productsData.total}
            initialHasMore={productsData.hasMore}
          />
        </Container>
      </section>

      {/* Home Collections Section */}
      <HomeCollectionsSection collectionsWithProducts={homeCollectionsData.collections ?? []} />

      {/* Home Categories Section */}
      <HomeCategoriesSection categories={homeCategories ?? []} />

      {/* Reviews Section */}
      <HomeShowcaseReviewsSection reviews={showcaseReviews ?? []} />
    </main>
  );
}
