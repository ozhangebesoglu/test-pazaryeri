import { AxiosInstance } from 'axios';
import { ICartRepository } from '@/core/ports/repositories/ICartRepository';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/core/domain/entities/Cart';
import { CartDTO } from '@/types/api';
import { CartAdapter } from '../adapters/CartAdapter';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Cart Repository Implementation
 * Implements ICartRepository interface
 */
export class CartRepository implements ICartRepository {
  constructor(
    private readonly client: AxiosInstance,
    private readonly adapter: CartAdapter
  ) {}

  async getCart(): Promise<Cart> {
    try {
      const response = await this.client.get<CartDTO>(ENDPOINTS.cart.get);
      return this.adapter.toEntity(response.data);
    } catch (error) {
      // Return empty cart if not authenticated or cart not found
      if (this.isAuthError(error) || this.is404Error(error)) {
        return this.adapter.createEmpty();
      }
      throw error;
    }
  }

  async addItem(request: AddToCartRequest): Promise<Cart> {
    const response = await this.client.post<CartDTO>(ENDPOINTS.cart.add, {
      productId: request.productId,
      quantity: request.quantity,
      variantId: request.variantId,
    });
    return this.adapter.toEntity(response.data);
  }

  async updateItem(request: UpdateCartItemRequest): Promise<Cart> {
    const response = await this.client.put<CartDTO>(ENDPOINTS.cart.updateItem(request.itemId), {
      quantity: request.quantity,
      isSelected: request.isSelected,
    });
    return this.adapter.toEntity(response.data);
  }

  async removeItem(itemId: string): Promise<Cart> {
    const response = await this.client.delete<CartDTO>(ENDPOINTS.cart.removeItem(itemId));
    return this.adapter.toEntity(response.data);
  }

  async clearCart(): Promise<void> {
    await this.client.delete(ENDPOINTS.cart.clear);
  }

  async setAllSelected(selected: boolean): Promise<Cart> {
    const response = await this.client.patch<CartDTO>(ENDPOINTS.cart.selectAll, {
      selected,
    });
    return this.adapter.toEntity(response.data);
  }

  async getItem(itemId: string): Promise<CartItem | null> {
    const cart = await this.getCart();
    return cart.items.find((item) => item.id === itemId) || null;
  }

  private is404Error(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      (error as { statusCode: number }).statusCode === 404
    );
  }

  private isAuthError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      ((error as { statusCode: number }).statusCode === 401 ||
        (error as { statusCode: number }).statusCode === 403)
    );
  }
}
