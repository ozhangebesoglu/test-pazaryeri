import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Language } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { Typography, Icon } from '@/presentation/components/atoms';
import { MainLayout } from '@/presentation/components/templates';
import { getApiClient } from '@/infrastructure/api/client';
import { CategoryAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { Category } from '@/core/domain/entities/Category';

interface CategoriesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === 'tr' ? 'Kategoriler' : 'Categories',
    description:
      lang === 'tr'
        ? 'Tüm ürün kategorilerini keşfedin'
        : 'Explore all product categories',
  };
}

async function getCategoriesData() {
  const client = getApiClient();
  const categoryAdapter = new CategoryAdapter();

  try {
    const response = await client.get(ENDPOINTS.categories.list);
    return categoryAdapter.toTreeList(response.data);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export const revalidate = 600; // 10 minutes

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Language);
  const categories = await getCategoriesData();

  return (
    <MainLayout lang={lang} categories={categories}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-2">
            {lang === 'tr' ? 'Kategoriler' : 'Categories'}
          </Typography>
          <Typography variant="body" color="muted">
            {lang === 'tr'
              ? 'Aradığınız ürünleri kategorilere göre keşfedin'
              : 'Explore products by category'}
          </Typography>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Typography variant="body" color="muted">
              {lang === 'tr' ? 'Kategori bulunamadı' : 'No categories found'}
            </Typography>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface CategoryCardProps {
  category: Category;
  lang: string;
}

function CategoryCard({ category, lang }: CategoryCardProps) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Main Category Link */}
      <Link
        href={`/${lang}/categories/${category.slug}`}
        className="group block p-4"
      >
        <div className="flex items-center gap-4">
          {category.image ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
              <Icon name="menu" size="lg" className="text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div className="flex-1">
            <Typography variant="h5" className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {category.name}
            </Typography>
            {category.productCount > 0 && (
              <Typography variant="caption" color="muted">
                {category.productCount} {lang === 'tr' ? 'ürün' : 'products'}
              </Typography>
            )}
          </div>
          <Icon name="chevronRight" size="md" className="text-gray-400 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>

      {/* Subcategories */}
      {hasChildren && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-2">
            {category.children!.slice(0, 4).map((sub) => (
              <Link
                key={sub.id}
                href={`/${lang}/categories/${sub.slug}`}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
              >
                {sub.name}
              </Link>
            ))}
            {category.children!.length > 4 && (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-600 dark:text-gray-400">
                +{category.children!.length - 4} {lang === 'tr' ? 'daha' : 'more'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
