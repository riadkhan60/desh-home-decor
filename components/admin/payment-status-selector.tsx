'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePaymentStatus } from '@/lib/actions/orders';

interface PaymentStatusSelectorProps {
  orderId: string;
  currentStatus: string;
}

const PAYMENT_STATUSES = [
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REFUNDED', label: 'Refunded' },
] as const;

export function PaymentStatusSelector({
  orderId,
  currentStatus,
}: PaymentStatusSelectorProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as 'UNPAID' | 'PAID' | 'REFUNDED';
    const previousStatus = optimisticStatus;

    // Optimistic update
    setOptimisticStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updatePaymentStatus(orderId, newStatus);

      if (!result.success) {
        // Rollback on error
        setOptimisticStatus(previousStatus);
        alert(result.error || 'Failed to update payment status');
      } else {
        router.refresh();
      }
    } catch {
      // Rollback on error
      setOptimisticStatus(previousStatus);
      alert('Failed to update payment status');
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
      {PAYMENT_STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
