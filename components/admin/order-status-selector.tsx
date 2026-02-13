'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/lib/actions/orders';

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
] as const;

export function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as
      | 'PENDING'
      | 'PROCESSING'
      | 'SHIPPED'
      | 'DELIVERED'
      | 'CANCELLED'
      | 'RETURNED';
    const previousStatus = optimisticStatus;

    // Optimistic update
    setOptimisticStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updateOrderStatus(orderId, newStatus);

      if (!result.success) {
        // Rollback on error
        setOptimisticStatus(previousStatus);
        alert(result.error || 'Failed to update order status');
      } else {
        router.refresh();
      }
    } catch {
      // Rollback on error
      setOptimisticStatus(previousStatus);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={optimisticStatus}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className="rounded-lg border bg-background px-3 py-2 text-sm transition hover:bg-muted disabled:opacity-50"
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
