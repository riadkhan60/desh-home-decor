'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Image as ImageIcon,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Tags,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth } from '@/lib/hooks/use-admin-auth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/collections', label: 'Collections', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/sliders', label: 'Sliders', icon: ImageIcon },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isChecking, isAuthenticated } = useAdminAuth();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if not authenticated (useAdminAuth will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          {/* Logo */}
          <div className="border-b px-6 py-4">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold">Shilpini Admin</span>
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-foreground text-background'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4 space-y-2">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              ← Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background px-4 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <span className="text-lg font-bold">Shilpini Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-full border px-2 py-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex h-full w-80 max-w-[85vw] flex-col border-r bg-background shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <span className="text-lg font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-foreground text-background'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t p-4 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  ← Back to Site
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
