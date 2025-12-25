import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/core/domain/entities/Category';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms';

const translations = {
  tr: {
    products: 'ürün',
  },
  en: {
    products: 'products',
  },
};

interface CategoryCardProps {
  category: Category;
  lang?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * CategoryCard Component
 * Displays category with image and name
 */
export function CategoryCard({
  category,
  lang = 'tr',
  variant = 'default',
  className,
}: CategoryCardProps) {
  const t = translations[lang as keyof typeof translations] || translations.tr;
  if (variant === 'compact') {
    return (
      <Link
        href={`/${lang}/categories/${category.slug}`}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-600',
          className
        )}
      >
        {category.icon ? (
          <span className="text-2xl">{category.icon}</span>
        ) : category.image ? (
          <div className="relative h-10 w-10 overflow-hidden rounded">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
            <Icon name="chevronRight" size="md" className="text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {category.name}
          </h3>
          {category.productCount > 0 && (
            <span className="text-xs text-gray-500">
              {category.productCount} {t.products}
            </span>
          )}
        </div>
        <Icon name="chevronRight" size="sm" className="text-gray-400" />
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/categories/${category.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {category.icon ? (
              <span className="text-5xl">{category.icon}</span>
            ) : (
              <Icon name="home" size="xl" className="text-gray-300" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-center text-sm font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {category.name}
        </h3>
        {category.productCount > 0 && (
          <p className="mt-1 text-center text-xs text-gray-500">
            {category.productCount} {t.products}
          </p>
        )}
      </div>
    </Link>
  );
}
