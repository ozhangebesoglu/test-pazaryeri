import { IProductRepository } from '../../ports/repositories/IProductRepository';
import { ProductSummary } from '../../domain/entities/Product';

/**
 * Get Featured Products Use Case
 * Single Responsibility: Fetch featured/promoted products
 */
export class GetFeaturedProductsUseCase {
  private static readonly DEFAULT_LIMIT = 8;
  private static readonly MAX_LIMIT = 20;

  constructor(private readonly productRepository: IProductRepository) {}

  async execute(limit?: number): Promise<ProductSummary[]> {
    const normalizedLimit = this.normalizeLimit(limit);
    return this.productRepository.findFeatured(normalizedLimit);
  }

  private normalizeLimit(limit?: number): number {
    if (!limit || limit <= 0) {
      return GetFeaturedProductsUseCase.DEFAULT_LIMIT;
    }
    return Math.min(limit, GetFeaturedProductsUseCase.MAX_LIMIT);
  }
}
