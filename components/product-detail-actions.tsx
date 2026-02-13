'use client';

import { ShoppingCart, Check, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

type ProductVariant = {
  id: string;
  label: string;
  price: string;
  comparePrice?: string;
  stock: number;
};

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    price: string;
    featuredImage: string | null;
    stock: number | null;
    stockShow?: boolean;
    weight?: number | null;
    categoryName?: string | null;
    options?: {
      id: string;
      name: string;
      values: string[];
    }[];
    variants?: ProductVariant[];
  };
}

function formatPrice(value: string) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `TK ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const activeVariants = useMemo(
    () => (product.variants ?? []).filter((v) => v.stock > 0),
    [product.variants],
  );
  const hasVariants = activeVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    activeVariants.length === 1 ? activeVariants[0]! : null,
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const optionName = product.options?.[0]?.name ?? 'Variant';

  const effectivePrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : product.price;
  const effectiveStock = hasVariants && selectedVariant
    ? selectedVariant.stock
    : (product.stock ?? 0);

  const cartItem = items.find((item) => {
    if (item.id !== product.id) return false;
    if (hasVariants && selectedVariant) {
      return item.selectedOptions?.[optionName] === selectedVariant.label;
    }
    return !item.selectedOptions || Object.keys(item.selectedOptions).length === 0;
  });
  const currentCartQty = cartItem?.quantity || 0;
  const availableStock = effectiveStock - currentCartQty;

  const handleOptionSelect = (optName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optName]: value }));
    if (hasVariants) {
      const v = activeVariants.find((v) => v.label === value);
      setSelectedVariant(v ?? null);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedOptions((prev) => ({ ...prev, [optionName]: variant.label }));
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (product.options && product.options.length > 0 && !hasVariants) {
      const missingOptions = product.options.filter(
        (opt) => !selectedOptions[opt.name],
      );
      if (missingOptions.length > 0) {
        toast.error(
          `Please select ${missingOptions.map((o) => o.name).join(', ')}`,
        );
        return;
      }
    }

    if (availableStock <= 0) return;

    const cartItemData = {
      id: product.id,
      name: product.name,
      price: effectivePrice,
      featuredImage: product.featuredImage,
      stock: effectiveStock,
      weight: product.weight != null ? Number(product.weight) : null,
      categoryName: product.categoryName,
      selectedOptions: hasVariants
        ? { [optionName]: selectedVariant!.label }
        : Object.keys(selectedOptions).length > 0
          ? selectedOptions
          : undefined,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItemData);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const router = useRouter();

  // ... (previous code)

  const handleOrderNow = () => {
    if (hasVariants && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (product.options && product.options.length > 0 && !hasVariants) {
      const missingOptions = product.options.filter(
        (opt) => !selectedOptions[opt.name],
      );
      if (missingOptions.length > 0) {
        toast.error(
          `Please select ${missingOptions.map((o) => o.name).join(', ')}`,
        );
        return;
      }
    }

    if (availableStock <= 0) return;

    const cartItemData = {
      id: product.id,
      name: product.name,
      price: effectivePrice,
      featuredImage: product.featuredImage,
      stock: effectiveStock,
      weight: product.weight != null ? Number(product.weight) : null,
      categoryName: product.categoryName,
      selectedOptions: hasVariants
        ? { [optionName]: selectedVariant!.label }
        : Object.keys(selectedOptions).length > 0
          ? selectedOptions
          : undefined,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItemData);
    }

    router.push('/checkout');
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < availableStock) setQuantity(quantity + 1);
  };

  const showStockInfo = product.stockShow ?? false;

  // Out of stock (no variants)
  if (!hasVariants && (product.stock ?? 0) <= 0) {
    return (
      <div className="space-y-3 rounded-2xl bg-linear-to-br from-zinc-900 to-black p-5 border border-[#D4AF37]/25">
        {showStockInfo ? (
          <>
            <div className="rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-center text-sm font-medium text-red-100">
              Out of Stock
            </div>
            <p className="text-center text-xs text-gray-400">
              This product is currently unavailable
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            This product is currently unavailable
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-linear-to-br from-zinc-900 to-black p-5 border border-[#D4AF37]/25 shadow-xl">
      {/* Stock Status */}
      {showStockInfo && (
        <div className="rounded-lg border border-green-500/40 bg-green-900/30 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500" />
              <span className="text-xs font-medium text-green-900 dark:text-green-100">
                In Stock
              </span>
            </div>
            <span className="text-xs text-green-700 dark:text-green-300">
              {availableStock} available{currentCartQty > 0 && ` · ${currentCartQty} in cart`}
            </span>
          </div>
        </div>
      )}

      {/* Variant Selector (ProductVariant with price/stock) */}
      {hasVariants && (
        <div className="space-y-5">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Select {optionName}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {activeVariants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleVariantSelect(variant)}
                  disabled={variant.stock <= 0}
                  className={`min-w-14 rounded-lg border-2 px-4 py-2.5 text-left text-sm font-medium transition-all duration-200
                    ${
                      variant.stock <= 0
                        ? 'cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground line-through'
                        : isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] shadow-sm'
                          : 'border-border bg-card hover:border-[#D4AF37]/50 hover:bg-accent text-foreground'
                    }
                  `}
                >
                  <span className="block font-medium">{variant.label}</span>
                  <span className="block text-xs opacity-80">
                    {formatPrice(variant.price)}
                    {showStockInfo && variant.stock > 0 && (
                      <span className="ml-1">
                        · {variant.stock} in stock
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Options (when no variants - e.g. Size, Color) */}
      {!hasVariants && product.options && product.options.length > 0 && (
        <div className="space-y-5">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Select Options
            </h3>
          </div>
          {product.options.map((option) => (
            <div key={option.id} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-foreground">
                  {option.name}
                </label>
                {selectedOptions[option.name] && (
                  <span className="text-sm font-semibold text-[#D4AF37]">
                    {selectedOptions[option.name]}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleOptionSelect(option.name, value)}
                      className={`min-w-14 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all duration-200
                        ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] shadow-sm'
                            : 'border-border bg-card hover:border-[#D4AF37]/50 hover:bg-accent text-foreground'
                        }
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <div className="border-b pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
            Quantity
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center rounded-lg border-2 border-[#D4AF37]/30 bg-black shadow-sm">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex h-11 w-14 items-center justify-center border-x-2 border-border">
              <span className="text-base font-semibold">{quantity}</span>
            </div>
            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= availableStock}
              className="inline-flex h-11 w-11 items-center justify-center transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {showStockInfo && availableStock <= 5 && availableStock > 0 && (
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              Only {availableStock} left!
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={availableStock <= 0}
          className="inline-flex h-12 py-2 flex-1 items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-black font-medium transition-all hover:bg-[#F4E4C1] hover:shadow-lg hover:shadow-[#D4AF37]/50 disabled:opacity-50 disabled:cursor-not-allowed sm:h-13"
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOrderNow}
          className="inline-flex h-12 flex-1 items-center py-2 justify-center gap-2 rounded-full border-2 border-[#D4AF37] bg-transparent text-[#D4AF37] font-medium transition-all hover:bg-[#D4AF37] hover:text-black hover:shadow-lg sm:h-13"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Order Now</span>
        </button>
      </div>

      {showStockInfo && availableStock <= 0 && (
        <p className="text-center text-sm font-medium text-destructive">
          Cannot add more - stock limit reached
        </p>
      )}
    </div>
  );
}
