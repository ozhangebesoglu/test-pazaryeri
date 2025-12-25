import { Category, CategoryTreeNode, CategoryParent } from '@/core/domain/entities/Category';
import { CategoryDTO, ApiResponseDTO } from '@/types/api';

/**
 * Category Adapter
 * Transforms API DTOs to domain entities
 */
export class CategoryAdapter {
  /**
   * Transform CategoryDTO to Category entity
   */
  toEntity(dto: CategoryDTO, level: number = 0): Category {
    return {
      id: String(dto.id),
      slug: dto.slug,
      name: dto.name,
      description: undefined,
      image: dto.image?.url,
      icon: undefined,
      parentId: dto.parentCategoryId ? String(dto.parentCategoryId) : null,
      parent: undefined,
      children: dto.subCategories?.map((c) => this.toEntity(c, level + 1)),
      level: level,
      order: 0,
      productCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Transform CategoryDTO to CategoryTreeNode
   */
  toTreeNode(dto: CategoryDTO, level: number = 0): CategoryTreeNode {
    return {
      ...this.toEntity(dto, level),
      children: dto.subCategories?.map((c) => this.toTreeNode(c, level + 1)) || [],
    };
  }

  /**
   * Transform array of CategoryDTO to tree structure
   */
  toTree(dtos: CategoryDTO[]): CategoryTreeNode[] {
    // Check if data has subCategories (already hierarchical)
    const hasSubCategories = dtos.some((d) => d.subCategories && d.subCategories.length > 0);

    if (hasSubCategories) {
      return dtos
        .filter((d) => !d.parentCategoryId)
        .map((d) => this.toTreeNode(d));
    }

    // Build tree from flat structure
    const map = new Map<string, CategoryTreeNode>();
    const roots: CategoryTreeNode[] = [];

    // First pass: create all nodes
    for (const dto of dtos) {
      map.set(String(dto.id), {
        ...this.toEntity(dto),
        children: [],
      });
    }

    // Second pass: build relationships
    for (const dto of dtos) {
      const node = map.get(String(dto.id))!;
      if (dto.parentCategoryId) {
        const parent = map.get(String(dto.parentCategoryId));
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  /**
   * Transform CategoryDTO array to Category array
   */
  toEntityList(data: CategoryDTO[] | ApiResponseDTO<CategoryDTO[]>): Category[] {
    // Handle both array and wrapped response
    const dtos = Array.isArray(data) ? data : data.data;
    if (!dtos || !Array.isArray(dtos)) {
      return [];
    }
    return dtos.map((dto) => this.toEntity(dto));
  }

  /**
   * Transform CategoryDTO array to tree
   */
  toTreeList(data: CategoryDTO[] | ApiResponseDTO<CategoryDTO[]>): CategoryTreeNode[] {
    const dtos = Array.isArray(data) ? data : data.data;
    if (!dtos || !Array.isArray(dtos)) {
      return [];
    }
    return this.toTree(dtos);
  }

  private toCategoryParent(dto: { id: number; slug: string; name: string }): CategoryParent {
    return {
      id: String(dto.id),
      slug: dto.slug,
      name: dto.name,
    };
  }
}
