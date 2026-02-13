"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, SlidersHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

interface CollectionOption {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  categories: Category[];
  collections?: CollectionOption[];
}

export function ProductFilters({ categories, collections = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentCollection = searchParams.get("collection") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });

    // Close drawer on mobile after filter change
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push("/shop");
    });
    setIsOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateFilters("sort", e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={isPending}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider">
            Collections
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="collection"
                value=""
                checked={currentCollection === ""}
                onChange={(e) => updateFilters("collection", e.target.value)}
                className="h-4 w-4"
                disabled={isPending}
              />
              <span>All Products</span>
            </label>
            {collections.map((c) => (
              <label
                key={c.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="collection"
                  value={c.value}
                  checked={currentCollection === c.value}
                  onChange={(e) => updateFilters("collection", e.target.value)}
                  className="h-4 w-4"
                  disabled={isPending}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value=""
                checked={currentCategory === ""}
                onChange={(e) => updateFilters("category", e.target.value)}
                className="h-4 w-4"
                disabled={isPending}
              />
              <span>All Categories</span>
            </div>
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={currentCategory === category.id}
                  onChange={(e) => updateFilters("category", e.target.value)}
                  className="h-4 w-4"
                  disabled={isPending}
                />
                <span>{category.name}</span>
              </div>
              {category._count && (
                <span className="text-xs text-muted-foreground">
                  ({category._count.products})
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory || currentCollection || currentSort !== "newest") && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          disabled={isPending}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters & Sort
      </button>

      {/* Desktop Filters (always visible) */}
      <div className="hidden lg:block">{filterContent}</div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 flex bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex h-full w-80 max-w-[85vw] flex-col border-r bg-background shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-muted"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6">{filterContent}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
