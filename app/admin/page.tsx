/* eslint-disable @next/next/no-html-link-for-pages */
import { prisma } from "@/lib/prisma";
import { Package, FolderTree, MessageSquare, Image as ImageIcon } from "lucide-react";

export const revalidate = 0; // Always fetch fresh data for admin

export default async function AdminDashboard() {
  const [productsCount, categoriesCount, slidersCount, pendingReviews] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.review.count(),
      prisma.sliderContent.count(),
      prisma.review.count({ where: { isApproved: false } }),
    ]);

  const stats = [
    {
      label: "Total Products",
      value: productsCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Categories",
      value: categoriesCount,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      label: "Pending Reviews",
      value: pendingReviews,
      icon: MessageSquare,
      href: "/admin/reviews",
      highlight: pendingReviews > 0,
    },
    {
      label: "Hero Sliders",
      value: slidersCount,
      icon: ImageIcon,
      href: "/admin/sliders",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Welcome to your admin panel
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className={`group flex flex-col gap-2 rounded-xl border bg-card p-4 transition hover:shadow-lg sm:gap-3 sm:rounded-2xl sm:p-6 ${
              stat.highlight ? "border-destructive/20 bg-destructive/5" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <stat.icon
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  stat.highlight ? "text-destructive" : "text-muted-foreground"
                }`}
              />
              {stat.highlight && (
                <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white sm:px-2 sm:text-xs">
                  New
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl">{stat.value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-6">
        <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/products/new"
            className="rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted sm:py-3"
          >
            + Add New Product
          </a>
          <a
            href="/admin/categories/new"
            className="rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted sm:py-3"
          >
            + Add New Category
          </a>
          <a
            href="/admin/sliders/new"
            className="rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted sm:py-3"
          >
            + Add New Slider
          </a>
        </div>
      </div>
    </div>
  );
}
