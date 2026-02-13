'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type CollectionOption = {
  value: string;
  label: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

interface CollectionFilterProps {
  collections: CollectionOption[];
  categories: CategoryOption[];
}

export function CollectionFilter({
  collections,
  categories,
}: CollectionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const currentCollection = searchParams.get('collection');
  const currentCategory = searchParams.get('category');

  const handleCollectionSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === '__ALL__') {
      params.delete('collection');
      params.delete('category');
    } else if (currentCollection === value) {
      params.delete('collection');
      params.delete('category');
    } else {
      params.set('collection', value);
      // when changing collection, reset category
      params.delete('category');
    }

    params.delete('skip'); // Reset pagination
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === '__ALL__') {
      params.delete('category');
    } else if (currentCategory === categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }

    params.delete('skip');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('collection');
    params.delete('category');
    params.delete('skip');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const selectedCollectionLabel = collections.find(
    (c) => c.value === currentCollection,
  )?.label;

  const selectedCategoryLabel = categories.find(
    (c) => c.id === currentCategory,
  )?.name;

  return (
    <div className="w-full space-y-3">
      {(currentCollection || currentCategory) && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleClearAll}
            className="rounded-full border border-destructive/40 bg-destructive/5 px-2.5 py-0.5 text-[14px] font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
      {/* Collections Accordion */}
      <div className="w-full">
        <button
          onClick={() => setIsCollectionsOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg border-2 border-border bg-card px-2 py-2 text-[12px] md:text-[16px] font-medium transition-all hover:bg-accent hover:shadow-md"
        >
          <span className="text-foreground truncate">
            {selectedCollectionLabel || 'Filter by Collection'}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
              isCollectionsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollectionsOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-1.5 space-y-1.5 rounded-lg border-2 border-border bg-card p-2">
            <button
              onClick={() => handleCollectionSelect('__ALL__')}
              className={`w-full rounded-md px-2 py-1.5 text-left text-[12px] md:text-[14px] font-medium transition-all duration-200 ${
                !currentCollection
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted hover:bg-accent hover:shadow-sm'
              }`}
            >
              All Collections
            </button>
            <div className="grid grid-cols-1 gap-1">
              {collections.map((collection) => {
                const isSelected = currentCollection === collection.value;
                return (
                  <button
                    key={collection.value}
                    onClick={() => handleCollectionSelect(collection.value)}
                    className={`rounded-md px-2 py-1 text-left text-[12px] md:text-[14px] font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted hover:bg-accent hover:shadow-sm'
                    }`}
                  >
                    {collection.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="w-full">
        <button
          onClick={() => setIsCategoriesOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg border-2 border-border bg-card px-2 py-2 text-[12px] md:text-[16px] font-medium transition-all hover:bg-accent hover:shadow-md"
        >
          <span className="text-foreground truncate">
            {selectedCategoryLabel || 'Filter by Category'}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
              isCategoriesOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCategoriesOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-1.5 space-y-1.5 rounded-lg border-2 border-border bg-card p-2">
            <button
              onClick={() => handleCategorySelect('__ALL__')}
              className={`w-full rounded-md px-2 py-1.5 text-left text-[12px] md:text-[14px] font-medium transition-all duration-200 ${
                !currentCategory
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted hover:bg-accent hover:shadow-sm'
              }`}
            >
              All Categories
            </button>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`rounded-md px-2 py-1 text-left text-[12px] md:text-[14px] font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted hover:bg-accent hover:shadow-sm'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
