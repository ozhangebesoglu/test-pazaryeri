import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class merging
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Money-like type (supports both Money instance and serialized plain object)
 */
export type MoneyLike = { amount: number; currency: string; format?: (locale?: string) => string };

/**
 * Format money value (handles both Money instance and plain object)
 * Use this when dealing with serialized data from Server Components
 */
export function formatMoney(value: MoneyLike, locale = 'tr-TR'): string {
  // Check if it's a Money instance with format method
  if (typeof value.format === 'function') {
    return value.format(locale);
  }
  // Handle plain object (serialized from server)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency || 'TRY',
    minimumFractionDigits: 2,
  }).format(value.amount);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
