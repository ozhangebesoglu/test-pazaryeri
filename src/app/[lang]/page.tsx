import { Metadata } from 'next';
import Link from 'next/link';
import { Language } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { Typography, Button, Icon } from '@/presentation/components/atoms';
import { ProductGrid } from '@/presentation/components/organisms';
import { MainLayout } from '@/presentation/components/templates';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter, CategoryAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generate metadata for homepage
 */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Language);

  return {
    title: lang === 'tr' ? 'Ana Sayfa' : 'Home',
    description:
      lang === 'tr'
        ? 'Pazaryeri - Türkiye\'nin en güvenilir online alışveriş platformu'
        : 'Pazaryeri - Turkey\'s most trusted online shopping platform',
    alternates: {
      canonical: `/${lang}`,
      languages: {
        tr: '/tr',
        en: '/en',
      },
    },
  };
}

/**
 * Fetch featured products and categories
 */
async function getHomePageData() {
  const client = getApiClient();
  const productAdapter = new ProductAdapter();
  const categoryAdapter = new CategoryAdapter();

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      client.get(ENDPOINTS.products.list, {
        params: { limit: 8 },
      }),
      client.get(ENDPOINTS.categories.list, {
        params: { hasTree: true },
      }),
    ]);

    return {
      featuredProducts: productsRes.data.data?.map((p: unknown) =>
        productAdapter.toSummary(p as Parameters<typeof productAdapter.toSummary>[0])
      ) || [],
      categories: categoryAdapter.toEntityList(categoriesRes.data || []),
    };
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    return {
      featuredProducts: [],
      categories: [],
    };
  }
}

/**
 * Homepage Component
 * SSG with ISR - revalidates every 60 seconds
 */
export const revalidate = 60;

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Language);
  const { featuredProducts, categories } = await getHomePageData();

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pazaryeri',
    url: `https://pazaryeri.com/${lang}`,
    description:
      lang === 'tr'
        ? 'Türkiye\'nin en güvenilir online alışveriş platformu'
        : 'Turkey\'s most trusted online shopping platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://pazaryeri.com/${lang}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pazaryeri',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pazaryeri.com/logo.png',
      },
    },
  };

  return (
    <MainLayout lang={lang} categories={categories}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Typography variant="h1" className="mb-4 text-white">
              {lang === 'tr'
                ? 'Binlerce Ürün, Tek Adreste'
                : 'Thousands of Products, One Destination'}
            </Typography>
            <Typography variant="lead" className="mb-8 text-primary-100">
              {lang === 'tr'
                ? 'Güvenli alışveriş, hızlı teslimat ve uygun fiyatlarla en iyi ürünlere ulaşın.'
                : 'Safe shopping, fast delivery, and access to the best products at affordable prices.'}
            </Typography>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href={`/${lang}/products`}>
                <Button size="lg" variant="secondary">
                  {lang === 'tr' ? 'Ürünleri Keşfet' : 'Explore Products'}
                </Button>
              </Link>
              <Link href={`/${lang}/categories`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {lang === 'tr' ? 'Kategorilere Göz At' : 'Browse Categories'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100 bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <Icon name="cart" size="lg" className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <Typography variant="h6">
                  {lang === 'tr' ? 'Ücretsiz Kargo' : 'Free Shipping'}
                </Typography>
                <Typography variant="caption">
                  {lang === 'tr' ? '150 TL üzeri siparişlerde' : 'On orders over 150 TL'}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Icon name="check" size="lg" className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <Typography variant="h6">
                  {lang === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}
                </Typography>
                <Typography variant="caption">
                  {lang === 'tr' ? '256-bit SSL şifreleme' : '256-bit SSL encryption'}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Icon name="star" size="lg" className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <Typography variant="h6">
                  {lang === 'tr' ? 'Kolay İade' : 'Easy Returns'}
                </Typography>
                <Typography variant="caption">
                  {lang === 'tr' ? '14 gün içinde ücretsiz iade' : 'Free returns within 14 days'}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <Typography variant="h2">
              {lang === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </Typography>
            <Link href={`/${lang}/products`}>
              <Button variant="ghost" rightIcon={<Icon name="chevronRight" size="sm" />}>
                {dict.common.seeAll}
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} lang={lang} columns={4} />
          ) : (
            <div className="py-12 text-center">
              <Typography variant="body" color="muted">
                {lang === 'tr' ? 'Ürünler yükleniyor...' : 'Loading products...'}
              </Typography>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-gray-50 py-12 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <Typography variant="h2">
                {lang === 'tr' ? 'Kategoriler' : 'Categories'}
              </Typography>
              <Link href={`/${lang}/categories`}>
                <Button variant="ghost" rightIcon={<Icon name="chevronRight" size="sm" />}>
                  {dict.common.seeAll}
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/${lang}/categories/${category.slug}`}
                  className="group flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  {category.icon && (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                  <div className="flex-1">
                    <Typography variant="h6" className="group-hover:text-primary-600">
                      {category.name}
                    </Typography>
                    {category.productCount > 0 && (
                      <Typography variant="caption">
                        {category.productCount} {lang === 'tr' ? 'ürün' : 'products'}
                      </Typography>
                    )}
                  </div>
                  <Icon name="chevronRight" size="sm" className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
