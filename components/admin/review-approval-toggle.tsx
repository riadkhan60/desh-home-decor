'use client';

import { useState } from 'react';
import { toggleReviewApproval } from '@/lib/actions/reviews';

interface ReviewApprovalToggleProps {
  id: string;
  isApproved: boolean;
}

export function ReviewApprovalToggle({
  id,
  isApproved: initialIsApproved,
}: ReviewApprovalToggleProps) {
  const [isApproved, setIsApproved] = useState(initialIsApproved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isApproved;
    setIsLoading(true);

    // Optimistic update
    setIsApproved(newStatus);

    try {
      const res = await toggleReviewApproval(id, newStatus);
      if (!res.success) {
        // Rollback on error
        setIsApproved(!newStatus);
        alert(res.error || 'Failed to update approval status');
      }
    } catch {
      // Rollback on error
      setIsApproved(!newStatus);
      alert('Failed to update approval status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition ${
        isApproved
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
      } disabled:opacity-50`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isApproved ? 'bg-green-600' : 'bg-yellow-600'
        }`}
      />
      {isApproved ? 'Approved' : 'Pending'}
    </button>
  );
}
