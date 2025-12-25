import { IProductRepository } from '../../ports/repositories/IProductRepository';
import { ProductFilters, ProductSummary } from '../../domain/entities/Product';
import { PaginatedResult } from '../../../types/common';

/**
 * Get Products Use Case
 * Single Responsibility: Fetch products with filters
 */
export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters: ProductFilters = {}): Promise<PaginatedResult<ProductSummary>> {
    const normalizedFilters = this.normalizeFilters(filters);
    return this.productRepository.findAll(normalizedFilters);
  }

  private normalizeFilters(filters: ProductFilters): ProductFilters {
    return {
      page: filters.page ?? 1,
      limit: Math.min(filters.limit ?? 20, 100),
      sortBy: filters.sortBy ?? 'newest',
      ...filters,
    };
  }
}
