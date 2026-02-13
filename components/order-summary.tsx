'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';

function formatPrice(value: string | number) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `৳ ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

interface OrderSummaryProps {
  shippingCost?: number;
}

export function OrderSummary({ shippingCost = 0 }: OrderSummaryProps) {
  const { items, totalPrice } = useCart();
  const subtotal = Number(totalPrice);
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border-0 bg-muted/30 p-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">
        Order Summary
      </h2>

      <div className="mb-8 space-y-6">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex gap-4 items-start">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-0 bg-background shadow-sm">
              {item.featuredImage ? (
                <Image
                  src={item.featuredImage}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground/50 bg-muted/50">
                  No img
                </div>
              )}
              <div className="absolute top-0 right-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background shadow-sm ring-2 ring-background z-10">
                {item.quantity}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between h-full py-1">
              <div>
                <h3 className="line-clamp-2 text-sm font-medium leading-relaxed">
                  {item.name}
                </h3>
                {item.selectedOptions && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Object.values(item.selectedOptions).join(' / ')}
                  </p>
                )}
              </div>
              <div className="mt-2 text-sm font-semibold">
                {formatPrice((Number(item.price) * item.quantity).toString())}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-dashed border-gray-200 dark:border-gray-800 pt-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shippingCost > 0 ? (
              formatPrice(shippingCost)
            ) : (
              <span className="text-muted-foreground italic">
                Select location
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
        <span className="text-base font-medium">Total</span>
        <span className="text-xl font-bold tracking-tight">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
