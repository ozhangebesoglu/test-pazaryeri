import { Money } from '@/core/domain/value-objects/Money';
import { cn } from '@/lib/utils';

// Support both Money instance and serialized plain object
type MoneyLike = Money | { amount: number; currency: string };

interface PriceDisplayProps {
  price: MoneyLike;
  originalPrice?: MoneyLike;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    price: 'text-sm font-semibold',
    original: 'text-xs',
    badge: 'text-xs px-1.5 py-0.5',
  },
  md: {
    price: 'text-lg font-bold',
    original: 'text-sm',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    price: 'text-2xl font-bold',
    original: 'text-base',
    badge: 'text-sm px-2 py-1',
  },
};

/**
 * Format money value (handles both Money instance and plain object)
 */
function formatMoney(value: MoneyLike, locale = 'tr-TR'): string {
  // Check if it's a Money instance with format method
  if (value instanceof Money || typeof (value as Money).format === 'function') {
    return (value as Money).format(locale);
  }
  // Handle plain object (serialized from server)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency || 'TRY',
    minimumFractionDigits: 2,
  }).format(value.amount);
}

/**
 * Get amount from MoneyLike
 */
function getAmount(value: MoneyLike): number {
  return value.amount;
}

/**
 * PriceDisplay Component
 * Shows price with optional original price and discount
 */
export function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const priceAmount = getAmount(price);
  const originalAmount = originalPrice ? getAmount(originalPrice) : 0;
  const hasDiscount = originalPrice && originalAmount > priceAmount;
  const discountPercentage = hasDiscount
    ? Math.round(((originalAmount - priceAmount) / originalAmount) * 100)
    : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className={cn(sizeClasses[size].price, 'text-gray-900 dark:text-white')}>
        {formatMoney(price)}
      </span>

      {hasDiscount && originalPrice && (
        <>
          <span
            className={cn(
              sizeClasses[size].original,
              'text-gray-500 line-through dark:text-gray-400'
            )}
          >
            {formatMoney(originalPrice)}
          </span>

          {showDiscount && (
            <span
              className={cn(
                sizeClasses[size].badge,
                'rounded-md bg-red-100 font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              %{discountPercentage}
            </span>
          )}
        </>
      )}
    </div>
  );
}
