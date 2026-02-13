'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteOrder } from '@/lib/actions/orders';

interface DeleteOrderButtonProps {
  orderId: string;
  orderNumber: string;
}

export function DeleteOrderButton({
  orderId,
  orderNumber,
}: DeleteOrderButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteOrder(orderId);
      if (!result.success) {
        alert(result.error || 'Failed to delete order');
        setIsDeleting(false);
      } else {
        router.push('/admin/orders');
        router.refresh();
      }
    } catch {
      alert('Failed to delete order');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
    >
      {isDeleting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete Order
        </>
      )}
    </button>
  );
}
