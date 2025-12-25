import {
  Product,
  ProductSummary,
  ProductImage,
  ProductVariant,
  CategoryRef,
  BrandRef,
  MerchantRef,
  ProductStatus,
} from '@/core/domain/entities/Product';
import { Money } from '@/core/domain/value-objects/Money';
import {
  ProductDTO,
  ImageDTO,
  ProductVariantDTO,
  PaginatedResponseDTO,
  PaginationDTO,
} from '@/types/api';
import { PaginatedResult } from '@/types/common';

/**
 * Product Adapter
 * Transforms API DTOs to domain entities
 * Follows Adapter Pattern for clean separation
 */
export class ProductAdapter {
  /**
   * Transform ProductDTO to Product entity
   */
  toEntity(dto: ProductDTO): Product {
    const defaultVariant = dto.variants[0];
    const images = this.extractImages(dto.variants);

    return {
      id: String(dto.id),
      slug: dto.slug,
      name: dto.name,
      description: dto.description || '',
      shortDescription: dto.description?.substring(0, 150),
      price: Money.create(defaultVariant?.price || 0, 'TRY'),
      originalPrice: undefined,
      images: images,
      category: this.toCategoryRef(dto.parentCategory),
      categories: dto.parentCategory ? [this.toCategoryRef(dto.parentCategory)] : undefined,
      brand: dto.brand ? this.toBrandRef(dto.brand) : undefined,
      merchant: this.toMerchantRef(dto.merchant),
      stock: this.calculateTotalStock(dto.variants),
      sku: defaultVariant?.sku,
      rating: dto.statistics?.averageRating || 0,
      reviewCount: dto.statistics?.totalRatingCount || 0,
      status: this.toProductStatus(dto.status),
      variants: dto.variants.map((v) => this.toProductVariant(v)),
      attributes: undefined,
      tags: undefined,
      isFeatured: false,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
    };
  }

  /**
   * Transform ProductDTO to ProductSummary
   * Returns plain objects (MoneyValue) instead of Money class for RSC serialization
   */
  toSummary(dto: ProductDTO): ProductSummary {
    const defaultVariant = dto.variants[0];
    const firstImage = defaultVariant?.thumbnails?.[0];

    return {
      id: String(dto.id),
      slug: dto.slug,
      name: dto.name,
      price: { amount: defaultVariant?.price || 0, currency: 'TRY' },
      originalPrice: undefined,
      image: firstImage?.url || '/placeholder-product.jpg',
      rating: dto.statistics?.averageRating || 0,
      reviewCount: dto.statistics?.totalRatingCount || 0,
      merchant: {
        id: String(dto.merchant.id),
        name: dto.merchant.companyName,
      },
      stock: this.calculateTotalStock(dto.variants),
      isFeatured: false,
    };
  }

  /**
   * Transform paginated response to PaginatedResult
   */
  toPaginatedResult(response: PaginatedResponseDTO<ProductDTO>): PaginatedResult<ProductSummary> {
    const pagination = response.pagination || this.getDefaultPagination();

    return {
      data: (response.data || []).map((dto) => this.toSummary(dto)),
      pagination: {
        page: pagination.currentPage,
        limit: pagination.perPage,
        total: pagination.totalCount,
        totalPages: pagination.totalPages,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrevious,
      },
    };
  }

  /**
   * Extract images from all variants
   */
  private extractImages(variants: ProductVariantDTO[]): ProductImage[] {
    const images: ProductImage[] = [];
    let order = 0;

    for (const variant of variants) {
      for (const thumbnail of variant.thumbnails || []) {
        images.push(this.toProductImage(thumbnail, order++));
      }
    }

    return images;
  }

  private toProductImage(dto: ImageDTO, order: number): ProductImage {
    return {
      id: String(dto.id),
      url: dto.url,
      alt: dto.altText || dto.originalFileName || '',
      order: order,
    };
  }

  private toProductVariant(dto: ProductVariantDTO): ProductVariant {
    return {
      id: String(dto.id),
      name: dto.sku || `Variant ${dto.id}`,
      value: dto.barcode || '',
      price: Money.create(dto.price, 'TRY'),
      stock: dto.stock,
    };
  }

  private toCategoryRef(dto: { id: number; name: string; slug: string }): CategoryRef {
    return {
      id: String(dto.id),
      name: dto.name,
      slug: dto.slug,
    };
  }

  private toBrandRef(dto: { id: number; name: string; slug: string }): BrandRef {
    return {
      id: String(dto.id),
      name: dto.name,
      slug: dto.slug,
      logo: undefined,
    };
  }

  private toMerchantRef(dto: {
    id: number;
    companyName: string;
    slug: string;
    logo?: ImageDTO;
    statistics?: { averageRating?: number };
  }): MerchantRef {
    return {
      id: String(dto.id),
      name: dto.companyName,
      slug: dto.slug,
      logo: dto.logo?.url,
      rating: dto.statistics?.averageRating,
    };
  }

  private calculateTotalStock(variants: ProductVariantDTO[]): number {
    return variants.reduce((total, v) => total + (v.stock || 0), 0);
  }

  private toProductStatus(status: number): ProductStatus {
    // API uses numeric status: 0=draft, 1=active, 2=inactive, 3=out_of_stock
    const statusMap: Record<number, ProductStatus> = {
      0: 'draft',
      1: 'active',
      2: 'inactive',
      3: 'out_of_stock',
    };
    return statusMap[status] || 'inactive';
  }

  private getDefaultPagination(): PaginationDTO {
    return {
      currentPage: 1,
      perPage: 20,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }
}
