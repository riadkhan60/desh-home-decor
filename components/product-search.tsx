"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    // Reset to page 1 when search changes
    params.delete("page");

    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search products..."
        disabled={isPending}
        className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm transition placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
    </form>
  );
}
