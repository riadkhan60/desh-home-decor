import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/actions/products-list";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category") || undefined;
    const collection = searchParams.get("collection") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") as
      | "newest"
      | "oldest"
      | "price-asc"
      | "price-desc"
      | undefined;
    const skip = parseInt(searchParams.get("skip") || "0");

    const data = await getProducts({
      categoryId: category,
      collection,
      search,
      sortBy: sort,
      skip,
      take: 20,
    });

    const mappedProducts = data.products.map((p) => {
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
        weight: p.weight != null ? Number(p.weight) : null,
        category: p.category,
      };
    });

    return NextResponse.json({
      products: mappedProducts,
      total: data.total,
      hasMore: data.hasMore,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
