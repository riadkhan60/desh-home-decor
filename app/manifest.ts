import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://deshihomedecor.com';
  return {
    name: 'Deshi Home Decor',
    short_name: 'Deshi Home',
    description:
      'Premium bamboo, rattan, seagrass, jute and imported home decor. Handcrafted and eco-friendly lighting and decor for your space.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#D4AF37',
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: '/logo/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/logo/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
