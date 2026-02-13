import type { Metadata } from 'next';
import { Geist, Geist_Mono, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/components/react-query-provider';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['latin', 'bengali'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://deshihomedecor.com',
  ),
  title: 'Deshi Home Decor - Premium Home Lighting & Decor',
  description:
    'Discover Deshi Home Decor’s curated collection of handcrafted Bengali-inspired lighting and home decor pieces that bring a warm, luxurious ambiance to your space.',
  keywords: [
    'Deshi Home Decor',
    'home decor',
    'lighting',
    'lamps',
    'Bangladeshi decor',
    'Bengali decor',
    'premium lighting',
  ],
  openGraph: {
    title: 'Deshi Home Decor - Premium Home Lighting & Decor',
    description:
      'Explore handcrafted lighting and decor inspired by Bengali craftsmanship to transform your home with warm, luxurious light.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Deshi Home Decor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deshi Home Decor - Premium Home Lighting & Decor',
    description:
      'Explore handcrafted lighting and decor inspired by Bengali craftsmanship to transform your home with warm, luxurious light.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
      >
        <ReactQueryProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
