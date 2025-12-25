import { Money } from '../value-objects/Money';
import { ProductSummary, MoneyValue } from './Product';

/**
 * Cart Item Entity
 */
export interface CartItem {
  id: string;
  product: ProductSummary;
  quantity: number;
  variantId?: string;
  variantName?: string;
  isSelected: boolean;
  addedAt: Date;
}

/**
 * Cart Entity
 */
export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: Money;
  discount: Money;
  shippingCost: Money;
  total: Money;
  updatedAt: Date;
}

/**
 * Cart Summary (for header display)
 */
export interface CartSummary {
  itemCount: number;
  total: MoneyValue;
}

/**
 * Add to Cart Request
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variantId?: string;
}

/**
 * Update Cart Item Request
 */
export interface UpdateCartItemRequest {
  itemId: string;
  quantity?: number;
  isSelected?: boolean;
}

/**
 * Calculate cart item total
 * Returns MoneyValue (plain object) for RSC compatibility
 */
export function calculateItemTotal(item: CartItem): MoneyValue {
  return {
    amount: item.product.price.amount * item.quantity,
    currency: item.product.price.currency,
  };
}

/**
 * Calculate cart subtotal (selected items only)
 * Returns MoneyValue (plain object) for RSC compatibility
 */
export function calculateCartSubtotal(items: CartItem[]): MoneyValue {
  const selectedItems = items.filter((item) => item.isSelected);

  if (selectedItems.length === 0) {
    return { amount: 0, currency: 'TRY' };
  }

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.product.price.amount * item.quantity,
    0
  );

  return { amount: totalAmount, currency: 'TRY' };
}

/**
 * Get selected items count
 */
export function getSelectedItemsCount(items: CartItem[]): number {
  return items.filter((item) => item.isSelected).reduce((count, item) => count + item.quantity, 0);
}

/**
 * Check if all items are selected
 */
export function areAllItemsSelected(items: CartItem[]): boolean {
  return items.length > 0 && items.every((item) => item.isSelected);
}
