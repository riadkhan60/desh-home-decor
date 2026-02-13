'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { CartDrawer } from '@/components/cart-drawer';
import { Container } from '@/components/container';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/20 bg-black/95 backdrop-blur-lg">
        <Container className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={'/logo/logo.png'}
              alt="Deshi Home Decor logo"
              width={100}
              height={100}
              className="w-8 md:w-9"
            />
            <span className="text-xl md:text-2xl font-bold gold-gradient leading-none">
              Deshi Home <br className="sm:block" />
              <span className="sm:hidden"> </span>Decor
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="uppercase tracking-[0.18em] text-xs hover:text-[#D4AF37] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: hamburger + cart */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 bg-zinc-900/80 p-2 text-gray-200 transition hover:bg-[#D4AF37] hover:text-black md:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 bg-zinc-900/80 px-2 py-2 text-gray-200 transition hover:bg-[#D4AF37] hover:text-black"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-semibold text-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#D4AF37]/20 bg-black/95">
            <Container className="py-3">
              <nav className="flex flex-col gap-2 text-sm font-medium text-gray-200">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 uppercase tracking-[0.2em] text-xs hover:text-[#D4AF37] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Container>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
