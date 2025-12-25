import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Language } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { Typography, Button, Icon } from '@/presentation/components/atoms';
import { ProductGrid } from '@/presentation/components/organisms';
import { MainLayout } from '@/presentation/components/templates';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter, CategoryAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: lang === 'tr' ? 'Kategori Bulunamadı' : 'Category Not Found',
    };
  }

  return {
    title: category.name,
    description:
      lang === 'tr'
        ? `${category.name} kategorisindeki ürünleri keşfedin`
        : `Explore products in ${category.name} category`,
  };
}

async function getCategoryBySlug(slug: string) {
  const client = getApiClient();
  const categoryAdapter = new CategoryAdapter();

  try {
    const response = await client.get(ENDPOINTS.categories.bySlug(slug));
    if (response.data?.data) {
      return categoryAdapter.toEntity(response.data.data);
    }
    return categoryAdapter.toEntity(response.data);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

async function getCategoryProducts(categoryId: string, page: number = 1) {
  const client = getApiClient();
  const productAdapter = new ProductAdapter();

  try {
    const response = await client.get(ENDPOINTS.products.list, {
      params: {
        categoryId,
        page,
        limit: 20,
      },
    });
    return productAdapter.toPaginatedResult(response.data);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

async function getAllCategories() {
  const client = getApiClient();
  const categoryAdapter = new CategoryAdapter();

  try {
    const response = await client.get(ENDPOINTS.categories.list);
    return categoryAdapter.toEntityList(response.data);
  } catch {
    return [];
  }
}

export const revalidate = 600; // 10 minutes

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { lang, slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(category.id, currentPage);
  const dict = await getDictionary(lang as Language);

  // Build breadcrumb
  const breadcrumbs = [
    { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', href: `/${lang}` },
    { name: lang === 'tr' ? 'Kategoriler' : 'Categories', href: `/${lang}/categories` },
    { name: category.name, href: `/${lang}/categories/${category.slug}` },
  ];

  return (
    <MainLayout lang={lang} categories={allCategories}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <Icon name="chevronRight" size="sm" className="text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-500">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="text-primary-600 hover:underline">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            {category.name}
          </Typography>
          <Typography variant="body" color="muted">
            {products.pagination.total} {lang === 'tr' ? 'ürün bulundu' : 'products found'}
          </Typography>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-8">
            <Typography variant="h5" className="mb-4">
              {lang === 'tr' ? 'Alt Kategoriler' : 'Subcategories'}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {category.children.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${lang}/categories/${sub.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-primary-900/30"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products.data.length > 0 ? (
          <>
            <ProductGrid products={products.data} lang={lang} columns={4} />

            {/* Pagination */}
            {products.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {products.pagination.hasPrev && (
                  <Link
                    href={`/${lang}/categories/${slug}?page=${currentPage - 1}`}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-4 hover:border-primary-600 dark:border-gray-600"
                  >
                    <Icon name="chevronLeft" size="sm" />
                    {lang === 'tr' ? 'Önceki' : 'Previous'}
                  </Link>
                )}

                <span className="flex h-10 items-center px-4 text-sm text-gray-500">
                  {currentPage} / {products.pagination.totalPages}
                </span>

                {products.pagination.hasNext && (
                  <Link
                    href={`/${lang}/categories/${slug}?page=${currentPage + 1}`}
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-300 px-4 hover:border-primary-600 dark:border-gray-600"
                  >
                    {lang === 'tr' ? 'Sonraki' : 'Next'}
                    <Icon name="chevronRight" size="sm" />
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Icon name="search" size="xl" className="mx-auto mb-4 text-gray-300" />
            <Typography variant="body" color="muted" className="mb-4">
              {lang === 'tr'
                ? 'Bu kategoride ürün bulunamadı'
                : 'No products found in this category'}
            </Typography>
            <Link href={`/${lang}/products`}>
              <Button variant="outline">
                {lang === 'tr' ? 'Tüm Ürünlere Göz At' : 'Browse All Products'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
