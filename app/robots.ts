import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://deshihomedecor.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin-login',
        '/checkout/',
        '/api/',
        '/debug.log',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
