import { ICartRepository } from '../../ports/repositories/ICartRepository';
import { Cart, AddToCartRequest } from '../../domain/entities/Cart';

/**
 * Add To Cart Use Case
 * Single Responsibility: Add product to cart
 */
export class AddToCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(request: AddToCartRequest): Promise<Cart> {
    this.validate(request);
    return this.cartRepository.addItem(request);
  }

  private validate(request: AddToCartRequest): void {
    if (!request.productId) {
      throw new Error('Product ID is required');
    }
    if (request.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (request.quantity > 100) {
      throw new Error('Maximum quantity is 100');
    }
  }
}
