'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LocalCartItem } from '@/store/slices/cartSlice';
import { cn } from '@/lib/utils';
import { Button, Icon } from '../../atoms';
import { PriceDisplay } from '../PriceDisplay/PriceDisplay';

interface CartItemProps {
  item: LocalCartItem;
  lang?: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  className?: string;
}

/**
 * CartItem Component
 * Displays cart item with quantity controls
 */
export function CartItem({
  item,
  lang = 'tr',
  onUpdateQuantity,
  onRemove,
  className,
}: CartItemProps) {
  const { product, quantity } = item;
  const itemTotal = {
    amount: product.price.amount * quantity,
    currency: product.price.currency,
  };

  return (
    <div className={cn('flex gap-4 py-4', className)}>
      {/* Image */}
      <Link
        href={`/${lang}/products/${product.slug}`}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg"
      >
        <Image
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Title & Remove */}
        <div className="flex items-start justify-between">
          <Link href={`/${lang}/products/${product.slug}`}>
            <h4 className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
              {product.name}
            </h4>
          </Link>
          <button
            onClick={onRemove}
            className="ml-2 text-gray-400 transition-colors hover:text-red-500"
            aria-label="Ürünü kaldır"
          >
            <Icon name="trash" size="sm" />
          </button>
        </div>

        {/* Merchant */}
        <span className="mt-0.5 text-xs text-gray-500">{product.merchant.name}</span>

        {/* Quantity & Price */}
        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Azalt"
            >
              <Icon name="minus" size="sm" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
              aria-label="Artır"
            >
              <Icon name="plus" size="sm" />
            </Button>
          </div>

          {/* Item Total */}
          <PriceDisplay price={itemTotal} size="sm" />
        </div>
      </div>
    </div>
  );
}
