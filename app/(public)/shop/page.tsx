import { Container } from "@/components/container";
import { ProductsGrid } from "@/components/products-grid";
import { ProductSearch } from "@/components/product-search";
import { ShopFilterBar } from "@/components/shop-filter-bar";
import { getProducts, getAllCategories } from "@/lib/actions/products-list";
import { getCollections } from "@/lib/actions/collections";

export const revalidate = 3600;

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    search?: string;
    sort?: "newest" | "oldest" | "price-asc" | "price-desc";
    skip?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, collection, search, sort, skip } = params;

  const [productsData, categories, collectionsRes] = await Promise.all([
    getProducts({
      categoryId: category,
      collection,
      search,
      sortBy: sort,
      skip: skip ? parseInt(skip) : 0,
      take: 20,
    }),
    getAllCategories(),
    getCollections(),
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
      category: p.category,
    };
  });

  return (
    <main className="min-h-screen bg-background md:pb-8 pb-4 md:pt-20 pt-5 lg:pt-8">
      <Container>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shop All Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover our curated home decor and lighting collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <ProductSearch />
        </div>

        {/* Filter Bar - horizontal pill style */}
        <div className="mb-6 rounded-2xl border bg-card p-4">
          <ShopFilterBar
            categories={categories}
            collections={collections?.map((c) => ({ value: c.slug, label: c.name })) ?? []}
          />
        </div>

        {/* Products Grid */}
        <ProductsGrid
          initialProducts={mappedProducts}
          initialTotal={productsData.total}
          initialHasMore={productsData.hasMore}
        />
      </Container>
    </main>
  );
}
