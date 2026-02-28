'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';
import { reorderProducts } from '@/lib/actions/admin-products';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  featuredImage: string | null;
  sku: string | null;
  category: { id: string; name: string } | null;
  price: number | null;
  comparePrice: number | null;
  stock: number | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

interface Props {
  initialProducts: Product[];
}

function formatPrice(value: number) {
  return `৳ ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function SortableProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move 8px before activating drag
      // This prevents accidental drags when clicking links/buttons
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      // Press delay of 150ms prevents accidental drags on touch
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeProduct = activeId
    ? products.find((p) => p.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over?.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      // Prepare items for server update
      const itemsToUpdate = newProducts.map((p, index) => ({
        id: p.id,
        order: index,
      }));

      const result = await reorderProducts(itemsToUpdate);
      if (!result.success) {
        toast.error(result.error || 'Failed to update product order');
        setProducts(initialProducts);
      } else {
        toast.success('Product order updated');
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl border bg-card">
        <p className="text-muted-foreground">No products yet</p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={products} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden rounded-2xl border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-10 px-4 py-4"></th>
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
                    <SortableTableRow
                      key={product.id}
                      product={product}
                      isBeingDragged={product.id === activeId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
              <SortableCard
                key={product.id}
                product={product}
                isBeingDragged={product.id === activeId}
              />
            ))}
          </div>
        </div>
      </SortableContext>

      {/* Drag Overlay: renders a floating "ghost" copy while dragging */}
      <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
        {activeProduct ? <OverlayCard product={activeProduct} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Sortable Table Row ────────────────────────────────────────────────────────

function SortableTableRow({
  product,
  isBeingDragged,
}: {
  product: Product;
  isBeingDragged: boolean;
}) {
  // NOTE: CSS transforms do NOT work on <tr> elements because they participate
  // in the table layout algorithm. So we omit transform/transition here and
  // let the DragOverlay handle all visual movement. The source row just fades.
  const { attributes, listeners, setNodeRef } = useSortable({ id: product.id });

  return (
    <tr
      ref={setNodeRef}
      className={`transition-opacity ${
        isBeingDragged ? 'opacity-30 bg-muted/20' : 'hover:bg-muted/30'
      }`}
    >
      <td className="px-4 py-4 text-center align-middle">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          aria-label="Drag to reorder"
          style={{ touchAction: 'none' }}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </td>
      <ProductTableCells product={product} />
    </tr>
  );
}

// ─── Sortable Card ─────────────────────────────────────────────────────────────

function SortableCard({
  product,
  isBeingDragged,
}: {
  product: Product;
  isBeingDragged: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-card p-4 space-y-3 ${
        isBeingDragged ? 'opacity-40' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className="flex flex-col justify-center">
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
            style={{ touchAction: 'none' }}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-6 w-6" />
          </button>
        </div>
        <ProductCardContent product={product} />
      </div>
      <ProductCardDetails product={product} />
      <Link
        href={`/admin/products/${product.id}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        Edit Product
      </Link>
    </div>
  );
}

function OverlayCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 shadow-2xl ring-2 ring-primary/20">
      <div className="flex gap-3">
        <div className="flex flex-col justify-center text-muted-foreground">
          <GripVertical className="h-6 w-6" />
        </div>
        <ProductCardContent product={product} />
      </div>
      <ProductCardDetails product={product} />
    </div>
  );
}

// ─── Shared content sub-components ────────────────────────────────────────────

function ProductTableCells({ product }: { product: Product }) {
  return (
    <>
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
        <span className="text-sm">{product.category?.name || '—'}</span>
      </td>
      <td className="px-6 py-4">
        <div>
          <span className="font-medium">
            {product.price != null ? formatPrice(product.price) : '—'}
          </span>
          {product.comparePrice != null &&
            product.price != null &&
            product.comparePrice > product.price && (
              <p className="mt-0.5 text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </p>
            )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`text-sm ${
            product.stock === 0
              ? 'text-destructive'
              : product.stock != null && product.stock < 5
                ? 'text-yellow-600'
                : 'text-green-600'
          }`}
        >
          {product.stock}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            product.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          {product.isActive ? 'Active' : 'Inactive'}
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
    </>
  );
}

function ProductCardContent({ product }: { product: Product }) {
  return (
    <>
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
      <div className="flex-1 space-y-1.5">
        <h3 className="font-semibold line-clamp-2 leading-tight">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        )}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              product.isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </>
  );
}

function ProductCardDetails({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
      <div>
        <p className="text-xs text-muted-foreground">Category</p>
        <p className="font-medium">{product.category?.name || '—'}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Price</p>
        <p className="font-semibold">
          {product.price != null ? formatPrice(product.price) : '—'}
        </p>
      </div>
    </div>
  );
}
