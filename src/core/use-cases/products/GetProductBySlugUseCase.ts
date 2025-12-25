import { IProductRepository } from '../../ports/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

/**
 * Get Product By Slug Use Case
 * Single Responsibility: Fetch single product by slug
 */
export class GetProductBySlugUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(slug: string): Promise<Product | null> {
    if (!slug || slug.trim() === '') {
      throw new Error('Slug is required');
    }
    return this.productRepository.findBySlug(slug.trim().toLowerCase());
  }
}
