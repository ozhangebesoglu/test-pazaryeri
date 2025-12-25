import { Cart, CartItem } from '@/core/domain/entities/Cart';
import { ProductSummary } from '@/core/domain/entities/Product';
import { CartDTO, CartItemDTO, ProductDTO } from '@/types/api';
import { Money } from '@/core/domain/value-objects/Money';

/**
 * Cart Adapter
 * Transforms API DTOs to domain entities
 */
export class CartAdapter {
  /**
   * Transform CartDTO to Cart entity
   */
  toEntity(dto: CartDTO): Cart {
    const currency = dto.currency || 'TRY';

    return {
      id: dto.id,
      items: dto.items.map((item) => this.toCartItem(item, currency)),
      totalItems: dto.totalItems,
      subtotal: Money.create(dto.subtotal, currency),
      discount: Money.create(dto.discount, currency),
      shippingCost: Money.create(dto.shippingCost, currency),
      total: Money.create(dto.total, currency),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Transform CartItemDTO to CartItem entity
   */
  toCartItem(dto: CartItemDTO, currency = 'TRY'): CartItem {
    const product = dto.product
      ? this.toProductSummary(dto.product, currency)
      : this.createEmptyProduct();

    return {
      id: dto.id,
      product,
      quantity: dto.quantity,
      variantId: dto.variantId ? String(dto.variantId) : undefined,
      variantName: undefined,
      isSelected: dto.isSelected,
      addedAt: new Date(),
    };
  }

  private toProductSummary(dto: ProductDTO, currency: string): ProductSummary {
    const defaultVariant = dto.variants[0];
    const firstImage = defaultVariant?.thumbnails?.[0];

    return {
      id: String(dto.id),
      slug: dto.slug,
      name: dto.name,
      price: { amount: defaultVariant?.price || 0, currency },
      originalPrice: undefined,
      image: firstImage?.url || '/placeholder-product.jpg',
      rating: dto.statistics?.averageRating || 0,
      reviewCount: dto.statistics?.totalRatingCount || 0,
      merchant: {
        id: String(dto.merchant.id),
        name: dto.merchant.companyName,
      },
      stock: defaultVariant?.stock || 0,
      isFeatured: false,
    };
  }

  private createEmptyProduct(): ProductSummary {
    return {
      id: '',
      slug: '',
      name: 'Unknown Product',
      price: { amount: 0, currency: 'TRY' },
      originalPrice: undefined,
      image: '/placeholder-product.jpg',
      rating: 0,
      reviewCount: 0,
      merchant: { id: '', name: 'Unknown' },
      stock: 0,
      isFeatured: false,
    };
  }

  /**
   * Create empty cart
   */
  createEmpty(): Cart {
    return {
      id: '',
      items: [],
      totalItems: 0,
      subtotal: Money.zero('TRY'),
      discount: Money.zero('TRY'),
      shippingCost: Money.zero('TRY'),
      total: Money.zero('TRY'),
      updatedAt: new Date(),
    };
  }
}
