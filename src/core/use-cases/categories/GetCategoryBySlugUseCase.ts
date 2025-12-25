import { ICategoryRepository } from '../../ports/repositories/ICategoryRepository';
import { Category, CategoryBreadcrumb } from '../../domain/entities/Category';

/**
 * Category with Breadcrumbs
 */
export interface CategoryWithBreadcrumbs {
  category: Category;
  breadcrumbs: CategoryBreadcrumb[];
}

/**
 * Get Category By Slug Use Case
 * Single Responsibility: Fetch single category with breadcrumbs
 */
export class GetCategoryBySlugUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(slug: string): Promise<CategoryWithBreadcrumbs | null> {
    if (!slug || slug.trim() === '') {
      throw new Error('Slug is required');
    }

    const category = await this.categoryRepository.findBySlug(slug.trim().toLowerCase());
    if (!category) {
      return null;
    }

    const ancestors = await this.categoryRepository.findAncestors(category.id);
    const breadcrumbs: CategoryBreadcrumb[] = [
      ...ancestors.map((a) => ({ id: a.id, slug: a.slug, name: a.name })),
      { id: category.id, slug: category.slug, name: category.name },
    ];

    return { category, breadcrumbs };
  }
}
