import { AxiosInstance } from 'axios';
import { IProductRepository } from '@/core/ports/repositories/IProductRepository';
import { Product, ProductSummary, ProductFilters } from '@/core/domain/entities/Product';
import { PaginatedResult } from '@/types/common';
import { ProductDTO, PaginatedResponseDTO } from '@/types/api';
import { ProductAdapter } from '../adapters/ProductAdapter';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Product Repository Implementation
 * Implements IProductRepository interface
 * Uses Adapter Pattern for DTO → Entity transformation
 */
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly client: AxiosInstance,
    private readonly adapter: ProductAdapter
  ) {}

  async findAll(filters: ProductFilters): Promise<PaginatedResult<ProductSummary>> {
    const params = this.buildQueryParams(filters);
    const response = await this.client.get<PaginatedResponseDTO<ProductDTO>>(
      ENDPOINTS.products.list,
      { params }
    );
    return this.adapter.toPaginatedResult(response.data);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await this.client.get<ProductDTO>(ENDPOINTS.products.bySlug(slug));
      return this.adapter.toEntity(response.data);
    } catch (error) {
      // Return null for 404
      if (this.is404Error(error)) {
        return null;
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await this.client.get<ProductDTO>(ENDPOINTS.products.byId(id));
      return this.adapter.toEntity(response.data);
    } catch (error) {
      if (this.is404Error(error)) {
        return null;
      }
      throw error;
    }
  }

  async findByCategory(
    categoryId: string,
    filters?: Omit<ProductFilters, 'categoryId'>
  ): Promise<PaginatedResult<ProductSummary>> {
    return this.findAll({ ...filters, categoryId });
  }

  async findFeatured(limit = 8): Promise<ProductSummary[]> {
    const response = await this.client.get<PaginatedResponseDTO<ProductDTO>>(
      ENDPOINTS.products.list,
      {
        params: {
          isFeatured: true,
          limit,
          sortBy: 'popular',
        },
      }
    );
    return response.data.data.map((dto) => this.adapter.toSummary(dto));
  }

  async search(
    query: string,
    filters: ProductFilters = {}
  ): Promise<PaginatedResult<ProductSummary>> {
    return this.findAll({ ...filters, search: query });
  }

  async findRelated(productId: string, limit = 4): Promise<ProductSummary[]> {
    // Get the product first to find its category
    const product = await this.findById(productId);
    if (!product) {
      return [];
    }

    const response = await this.client.get<PaginatedResponseDTO<ProductDTO>>(
      ENDPOINTS.products.list,
      {
        params: {
          categoryId: product.category.id,
          limit: limit + 1, // Get one extra to filter out current product
        },
      }
    );

    return response.data.data
      .filter((dto) => String(dto.id) !== productId)
      .slice(0, limit)
      .map((dto) => this.adapter.toSummary(dto));
  }

  private buildQueryParams(filters: ProductFilters): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.categorySlug) params.categorySlug = filters.categorySlug;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.merchantId) params.merchantId = filters.merchantId;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.status) params.status = filters.status;
    if (filters.sortBy) params.sortBy = this.mapSortBy(filters.sortBy);
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return params;
  }

  private mapSortBy(
    sortBy: ProductFilters['sortBy']
  ): string {
    const sortMap: Record<NonNullable<ProductFilters['sortBy']>, string> = {
      price_asc: 'price:asc',
      price_desc: 'price:desc',
      newest: 'createdAt:desc',
      rating: 'rating:desc',
      popular: 'viewCount:desc',
    };
    return sortBy ? sortMap[sortBy] : 'createdAt:desc';
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
