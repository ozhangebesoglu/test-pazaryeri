import { IProductRepository } from '../../ports/repositories/IProductRepository';
import { ProductFilters, ProductSummary } from '../../domain/entities/Product';
import { PaginatedResult } from '../../../types/common';

/**
 * Search Products Use Case
 * Single Responsibility: Search products by query
 */
export class SearchProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    query: string,
    filters: ProductFilters = {}
  ): Promise<PaginatedResult<ProductSummary>> {
    if (!query || query.trim().length < 2) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return this.productRepository.search(query.trim(), filters);
  }
}
