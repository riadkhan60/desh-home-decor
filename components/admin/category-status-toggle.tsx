'use client';

import { useState } from 'react';
import { toggleCategoryStatus } from '@/lib/actions/categories';
import { Loader2 } from 'lucide-react';

interface CategoryStatusToggleProps {
  id: string;
  isActive: boolean;
}

export function CategoryStatusToggle({
  id,
  isActive: initialStatus,
}: CategoryStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Optimistic update
    const newStatus = !isActive;
    setIsActive(newStatus);

    try {
      const result = await toggleCategoryStatus(id, newStatus);
      if (!result.success) {
        // Revert if failed
        setIsActive(!newStatus);
        console.error(result.error);
      }
    } catch (error) {
      // Revert if error
      setIsActive(!newStatus);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
      }`}
    >
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      {isActive ? 'Active' : 'Draft'}
    </button>
  );
}
