import { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Generate sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Add language-specific routes
  for (const lang of LANGUAGES) {
    // Homepage
    routes.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Products page
    routes.push({
      url: `${BASE_URL}/${lang}/products`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    });

    // Categories page
    routes.push({
      url: `${BASE_URL}/${lang}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Cart page
    routes.push({
      url: `${BASE_URL}/${lang}/cart`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    });
  }

  return routes;
}
