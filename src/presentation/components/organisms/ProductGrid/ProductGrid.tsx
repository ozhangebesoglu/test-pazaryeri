'use client';

import { ProductSummary } from '@/core/domain/entities/Product';
import { ProductCard } from '../../molecules';
import { useCart } from '@/presentation/hooks/useCart';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: ProductSummary[];
  lang?: string;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

/**
 * ProductGrid Component
 * Grid layout for product cards
 */
export function ProductGrid({
  products,
  lang = 'tr',
  columns = 4,
  className,
}: ProductGridProps) {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Ürün bulunamadı</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          lang={lang}
          onAddToCart={() => addToCart(product)}
        />
      ))}
    </div>
  );
}
