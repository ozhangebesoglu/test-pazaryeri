import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository';
import { Category, CategoryTreeNode } from '../../domain/entities/Category';

/**
 * Get Categories Use Case
 * Single Responsibility: Fetch categories
 */
export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async executeAsTree(): Promise<CategoryTreeNode[]> {
    return this.categoryRepository.findTree();
  }

  async executeRoots(): Promise<Category[]> {
    return this.categoryRepository.findRoots();
  }
}
