import { Category, CategoryTreeNode } from '../../domain/entities/Category';

/**
 * Category Repository Interface
 * Defines the contract for category data access
 */
export interface ICategoryRepository {
  /**
   * Find all categories as flat list
   */
  findAll(): Promise<Category[]>;

  /**
   * Find all categories as tree structure
   */
  findTree(): Promise<CategoryTreeNode[]>;

  /**
   * Find category by ID
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Find category by slug
   */
  findBySlug(slug: string): Promise<Category | null>;

  /**
   * Find root categories (top level)
   */
  findRoots(): Promise<Category[]>;

  /**
   * Find children of a category
   */
  findChildren(parentId: string): Promise<Category[]>;

  /**
   * Find ancestors of a category (for breadcrumbs)
   */
  findAncestors(categoryId: string): Promise<Category[]>;
}
