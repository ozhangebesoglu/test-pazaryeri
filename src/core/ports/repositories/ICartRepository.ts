import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../../domain/entities/Cart';

/**
 * Cart Repository Interface
 * Defines the contract for cart data access
 */
export interface ICartRepository {
  /**
   * Get current user's cart
   */
  getCart(): Promise<Cart>;

  /**
   * Add item to cart
   */
  addItem(request: AddToCartRequest): Promise<Cart>;

  /**
   * Update cart item
   */
  updateItem(request: UpdateCartItemRequest): Promise<Cart>;

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): Promise<Cart>;

  /**
   * Clear all items from cart
   */
  clearCart(): Promise<void>;

  /**
   * Select/deselect all items
   */
  setAllSelected(selected: boolean): Promise<Cart>;

  /**
   * Get cart item by ID
   */
  getItem(itemId: string): Promise<CartItem | null>;
}
