'use client';

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  PROCESSING: {
    label: 'Processing',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  SHIPPED: {
    label: 'Shipped',
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  },
  DELIVERED: {
    label: 'Delivered',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  },
  RETURNED: {
    label: 'Returned',
    className:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
