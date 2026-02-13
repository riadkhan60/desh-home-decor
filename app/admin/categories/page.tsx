import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { getCategories } from '@/lib/actions/categories';
import { CategoryStatusToggle } from '@/components/admin/category-status-toggle';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const { data: categories, error } = await getCategories();

  if (error || !categories) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            Manage your product categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-2xl border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((category) => (
                <tr key={category.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4">
                    {category.image ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      /{category.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {category._count?.products || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <CategoryStatusToggle
                      id={category.id}
                      isActive={category.isActive}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {category.order}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        },
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/categories/${category.id}`}
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

        {categories.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No categories yet</p>
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first category
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex gap-3">
              {/* Category Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted border">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
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

              {/* Category Info */}
              <div className="flex-1 space-y-1.5">
                <h3 className="font-semibold line-clamp-2 leading-tight">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  /{category.slug}
                </p>
                <CategoryStatusToggle
                  id={category.id}
                  isActive={category.isActive}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-3 border-t pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="font-medium">{category._count?.products || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <p className="font-medium">{category.order}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-xs">
                  {new Date(category.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <Link
              href={`/admin/categories/${category.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Edit Category
            </Link>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No categories yet</p>
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add your first category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
