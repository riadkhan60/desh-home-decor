'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface CollectionOption {
  value: string;
  label: string;
}

interface ShopFilterBarProps {
  categories: Category[];
  collections?: CollectionOption[];
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
] as const;

export function ShopFilterBar({
  categories,
  collections = [],
}: ShopFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || '';
  const currentCollection = searchParams.get('collection') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const hasActiveFilters = currentCategory || currentCollection || currentSort !== 'newest';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('skip');
    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push('/shop', { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateFilters('sort', e.target.value)}
            disabled={isPending}
            className="h-10 appearance-none rounded-full border-2 border-border bg-background pl-4 pr-10 text-sm font-medium transition-all hover:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Collections pills */}
        {collections.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Collection
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => updateFilters('collection', '')}
                disabled={isPending}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  !currentCollection
                    ? 'bg-foreground text-background'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                All
              </button>
              {collections.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateFilters('collection', currentCollection === c.value ? '' : c.value)}
                  disabled={isPending}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    currentCollection === c.value
                      ? 'bg-foreground text-background'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Category
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => updateFilters('category', '')}
              disabled={isPending}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                !currentCategory
                  ? 'bg-foreground text-background'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateFilters('category', currentCategory === cat.id ? '' : cat.id)}
                disabled={isPending}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  currentCategory === cat.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat.name}
                {cat._count && (
                  <span className="ml-1 opacity-70">({cat._count.products})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            disabled={isPending}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {isPending && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full animate-pulse rounded-full bg-foreground/20" style={{ width: '40%' }} />
        </div>
      )}
    </div>
  );
}
