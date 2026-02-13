import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const revalidate = 0;

function formatPrice(value: number) {
  return `৳ ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-2xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {product.featuredImage ? (
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {product.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.comparePrice &&
                        Number(product.comparePrice) > Number(product.price) && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-through">
                            {formatPrice(Number(product.comparePrice))}
                          </p>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        product.stock === 0
                          ? "text-destructive"
                          : product.stock && product.stock < 5
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-medium text-foreground/80 transition hover:text-foreground hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products yet</p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first product
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex gap-3">
              {/* Product Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No img
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-1.5">
                <h3 className="font-semibold line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                {product.sku && (
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                  {product.isFeatured && (
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{product.category?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <div className="space-y-0.5">
                  <p className="font-semibold">
                    {formatPrice(Number(product.price))}
                  </p>
                  {product.comparePrice &&
                    Number(product.comparePrice) > Number(product.price) && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(Number(product.comparePrice))}
                      </p>
                    )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock</p>
                <p
                  className={`font-medium ${
                    product.stock === 0
                      ? "text-destructive"
                      : product.stock && product.stock < 5
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
              {/* Collections summary could go here once Collection model is wired into list query */}
            </div>

            {/* Edit Button */}
            <Link
              href={`/admin/products/${product.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Edit Product
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products yet</p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
