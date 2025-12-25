import { Metadata } from 'next';
import { Language } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { Typography } from '@/presentation/components/atoms';
import { ProductGrid } from '@/presentation/components/organisms';
import { MainLayout } from '@/presentation/components/templates';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter, CategoryAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === 'tr' ? 'Ürünler' : 'Products',
    description:
      lang === 'tr'
        ? 'Tüm ürünleri keşfedin ve en uygun fiyatlarla alışveriş yapın.'
        : 'Explore all products and shop at the best prices.',
  };
}

async function getProductsData(searchParams: Awaited<ProductsPageProps['searchParams']>) {
  const client = getApiClient();
  const productAdapter = new ProductAdapter();
  const categoryAdapter = new CategoryAdapter();

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      client.get(ENDPOINTS.products.list, {
        params: {
          search: searchParams.search || undefined,
          categoryId: searchParams.category || undefined,
          page: searchParams.page || 1,
          limit: 20,
        },
      }),
      client.get(ENDPOINTS.categories.list),
    ]);

    return {
      products: productAdapter.toPaginatedResult(productsRes.data),
      categories: categoryAdapter.toEntityList(categoriesRes.data || []),
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      products: {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      categories: [],
    };
  }
}

export const revalidate = 0; // SSR - always fresh

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const dict = await getDictionary(lang as Language);
  const { products, categories } = await getProductsData(resolvedSearchParams);

  return (
    <MainLayout lang={lang} categories={categories}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            {resolvedSearchParams.search
              ? `"${resolvedSearchParams.search}" ${lang === 'tr' ? 'için sonuçlar' : 'results'}`
              : lang === 'tr'
              ? 'Tüm Ürünler'
              : 'All Products'}
          </Typography>
          <Typography variant="body" color="muted">
            {products.pagination.total} {lang === 'tr' ? 'ürün bulundu' : 'products found'}
          </Typography>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products.data} lang={lang} columns={4} />

        {/* Pagination */}
        {products.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: products.pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <a
                  key={page}
                  href={`/${lang}/products?page=${page}${
                    resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''
                  }`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                    page === products.pagination.page
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 hover:border-primary-600 dark:border-gray-600'
                  }`}
                >
                  {page}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
