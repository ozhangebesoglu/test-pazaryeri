import { Product, ProductSummary, ProductFilters } from '../../domain/entities/Product';
import { PaginatedResult } from '../../../types/common';

/**
 * Product Repository Interface
 * Follows Interface Segregation Principle (ISP)
 * Defines the contract for product data access
 */
export interface IProductRepository {
  /**
   * Find all products with filters and pagination
   */
  findAll(filters: ProductFilters): Promise<PaginatedResult<ProductSummary>>;

  /**
   * Find product by slug
   */
  findBySlug(slug: string): Promise<Product | null>;

  /**
   * Find product by ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Find products by category
   */
  findByCategory(
    categoryId: string,
    filters?: Omit<ProductFilters, 'categoryId'>
  ): Promise<PaginatedResult<ProductSummary>>;

  /**
   * Find featured products
   */
  findFeatured(limit?: number): Promise<ProductSummary[]>;

  /**
   * Search products by query
   */
  search(query: string, filters?: ProductFilters): Promise<PaginatedResult<ProductSummary>>;

  /**
   * Find related products
   */
  findRelated(productId: string, limit?: number): Promise<ProductSummary[]>;
}
