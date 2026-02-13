'use client';

interface PaymentStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  UNPAID: {
    label: 'Unpaid',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  },
  PAID: {
    label: 'Paid',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  },
  REFUNDED: {
    label: 'Refunded',
    className:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.UNPAID;

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
