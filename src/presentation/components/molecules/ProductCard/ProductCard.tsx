'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductSummary, isInStock } from '@/core/domain/entities/Product';
import { cn } from '@/lib/utils';
import { Button, Icon, Badge } from '../../atoms';
import { PriceDisplay } from '../PriceDisplay/PriceDisplay';
import { useIsFavorite } from '@/presentation/hooks/useFavorites';
import { useStore } from '@/store';

const translations = {
  tr: {
    addToCart: 'Sepete Ekle',
    outOfStock: 'Stokta Yok',
    featured: 'Öne Çıkan',
    addToFavorites: 'Favorilere ekle',
    removeFromFavorites: 'Favorilerden çıkar',
  },
  en: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    featured: 'Featured',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
  },
};

interface ProductCardProps {
  product: ProductSummary;
  lang?: string;
  onAddToCart?: () => void;
  className?: string;
}

/**
 * ProductCard Component
 * Displays product summary with image, price, and actions
 */
export function ProductCard({ product, lang = 'tr', onAddToCart, className }: ProductCardProps) {
  const isFavorite = useIsFavorite(product.id);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const inStock = isInStock(product);
  const t = translations[lang as keyof typeof translations] || translations.tr;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900',
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/${lang}/products/${product.slug}`} className="relative aspect-square">
        <Image
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
          aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
        >
          <Icon
            name={isFavorite ? 'heartFilled' : 'heart'}
            size="md"
            className={cn(isFavorite ? 'text-red-500' : 'text-gray-600 dark:text-gray-300')}
          />
        </button>

        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge variant="primary" size="sm">
              {t.featured}
            </Badge>
          )}
          {!inStock && (
            <Badge variant="danger" size="sm">
              {t.outOfStock}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Merchant */}
        <span className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          {product.merchant.name}
        </span>

        {/* Title */}
        <Link href={`/${lang}/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="mb-2 flex items-center gap-1">
            <Icon name="starFilled" size="sm" className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          size="md"
          className="mb-3"
        />

        {/* Add to Cart */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={!inStock}
          onClick={handleAddToCart}
          leftIcon={<Icon name="cart" size="sm" />}
        >
          {inStock ? t.addToCart : t.outOfStock}
        </Button>
      </div>
    </motion.article>
  );
}
