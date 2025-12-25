import { AxiosInstance } from 'axios';
import { ICategoryRepository } from '@/core/ports/repositories/ICategoryRepository';
import { Category, CategoryTreeNode } from '@/core/domain/entities/Category';
import { CategoryDTO } from '@/types/api';
import { CategoryAdapter } from '../adapters/CategoryAdapter';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Category Repository Implementation
 * Implements ICategoryRepository interface
 */
export class CategoryRepository implements ICategoryRepository {
  constructor(
    private readonly client: AxiosInstance,
    private readonly adapter: CategoryAdapter
  ) {}

  async findAll(): Promise<Category[]> {
    const response = await this.client.get<CategoryDTO[]>(ENDPOINTS.categories.list);
    return this.adapter.toEntityList(response.data);
  }

  async findTree(): Promise<CategoryTreeNode[]> {
    const response = await this.client.get<CategoryDTO[]>(ENDPOINTS.categories.list, {
      params: { hasTree: true },
    });
    return this.adapter.toTree(response.data);
  }

  async findById(id: string): Promise<Category | null> {
    try {
      const response = await this.client.get<CategoryDTO>(ENDPOINTS.categories.byId(id));
      return this.adapter.toEntity(response.data);
    } catch (error) {
      if (this.is404Error(error)) {
        return null;
      }
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await this.client.get<CategoryDTO>(ENDPOINTS.categories.bySlug(slug));
      return this.adapter.toEntity(response.data);
    } catch (error) {
      if (this.is404Error(error)) {
        return null;
      }
      throw error;
    }
  }

  async findRoots(): Promise<Category[]> {
    const all = await this.findAll();
    return all.filter((cat) => cat.parentId === null);
  }

  async findChildren(parentId: string): Promise<Category[]> {
    const all = await this.findAll();
    return all.filter((cat) => cat.parentId === parentId);
  }

  async findAncestors(categoryId: string): Promise<Category[]> {
    const ancestors: Category[] = [];
    let current = await this.findById(categoryId);

    while (current?.parentId) {
      const parent = await this.findById(current.parentId);
      if (parent) {
        ancestors.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return ancestors;
  }

  private is404Error(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      (error as { statusCode: number }).statusCode === 404
    );
  }
}
