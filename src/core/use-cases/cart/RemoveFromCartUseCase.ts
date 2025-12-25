import { ICartRepository } from '../../ports/repositories/ICartRepository';
import { Cart } from '../../domain/entities/Cart';

/**
 * Remove From Cart Use Case
 * Single Responsibility: Remove item from cart
 */
export class RemoveFromCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(itemId: string): Promise<Cart> {
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    return this.cartRepository.removeItem(itemId);
  }
}
