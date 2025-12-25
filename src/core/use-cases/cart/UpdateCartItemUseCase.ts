import { ICartRepository } from '../../ports/repositories/ICartRepository';
import { Cart, UpdateCartItemRequest } from '../../domain/entities/Cart';

/**
 * Update Cart Item Use Case
 * Single Responsibility: Update cart item quantity or selection
 */
export class UpdateCartItemUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(request: UpdateCartItemRequest): Promise<Cart> {
    this.validate(request);
    return this.cartRepository.updateItem(request);
  }

  private validate(request: UpdateCartItemRequest): void {
    if (!request.itemId) {
      throw new Error('Item ID is required');
    }
    if (request.quantity !== undefined && request.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (request.quantity !== undefined && request.quantity > 100) {
      throw new Error('Maximum quantity is 100');
    }
  }
}
