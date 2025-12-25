import { Money } from '../value-objects/Money';

/**
 * Product Status Enum
 */
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock';

/**
 * Serializable Money Value (for RSC → Client Component transfer)
 */
export interface MoneyValue {
  amount: number;
  currency: string;
}

/**
 * Category Reference (lightweight)
 */
export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

/**
 * Brand Reference (lightweight)
 */
export interface BrandRef {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

/**
 * Merchant Reference (lightweight)
 */
export interface MerchantRef {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  rating?: number;
}

/**
 * Product Image
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

/**
 * Product Variant Option
 */
export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: Money;
  stock: number;
}

/**
 * Product Entity
 * Core domain entity representing a product
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: Money;
  originalPrice?: Money;
  images: ProductImage[];
  category: CategoryRef;
  categories?: CategoryRef[];
  brand?: BrandRef;
  merchant: MerchantRef;
  stock: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  status: ProductStatus;
  variants?: ProductVariant[];
  attributes?: Record<string, string>;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product Summary (for lists)
 * Uses MoneyValue instead of Money for RSC serialization
 */
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  price: MoneyValue;
  originalPrice?: MoneyValue;
  image: string;
  rating: number;
  reviewCount: number;
  merchant: Pick<MerchantRef, 'id' | 'name'>;
  stock: number;
  isFeatured?: boolean;
}

/**
 * Product Filters
 */
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  merchantId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(product: Product | ProductSummary): number | null {
  if (!product.originalPrice) return null;
  const discount =
    ((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100;
  return Math.round(discount);
}

/**
 * Check if product is in stock
 */
export function isInStock(product: Product | ProductSummary): boolean {
  return product.stock > 0;
}
