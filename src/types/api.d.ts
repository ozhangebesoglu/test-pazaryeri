/**
 * API Data Transfer Objects (DTOs)
 * These match the meshur.co API response structures
 */

// Image DTO (shared)
export interface ImageDTO {
  id: number;
  originalFileName: string;
  altText?: string;
  url: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Product Variant DTO
export interface ProductVariantDTO {
  id: number;
  productId: number;
  price: number;
  stock: number;
  barcode?: string;
  sku?: string;
  thumbnails: ImageDTO[];
}

// Product Statistics
export interface ProductStatisticsDTO {
  totalSaleCount: number;
  totalRatingCount: number;
  averageRating: number;
  totalClickCount: number;
}

// Merchant Statistics
export interface MerchantStatisticsDTO {
  totalFollowers: number;
  totalProducts: number;
  totalSales: number;
  totalRating: number;
  averageRating: number;
}

// Merchant Location
export interface MerchantLocationDTO {
  city: string;
  district: string;
}

// Merchant DTO
export interface MerchantDTO {
  id: number;
  companyName: string;
  slug: string;
  description?: string;
  location?: MerchantLocationDTO;
  statistics?: MerchantStatisticsDTO;
  logo?: ImageDTO;
}

// Brand DTO
export interface BrandDTO {
  id: number;
  name: string;
  slug: string;
  websiteUrl?: string;
}

// Category Reference DTO
export interface CategoryRefDTO {
  id: number;
  name: string;
  slug: string;
  parentCategoryId?: number | null;
  image?: ImageDTO;
}

// Category DTO (full)
export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  parentCategoryId: number | null;
  image?: ImageDTO;
  attributes?: CategoryAttributeDTO[];
  subCategories?: CategoryDTO[];
}

// Category Attribute DTO
export interface CategoryAttributeDTO {
  id: number;
  inputType: string;
  label: string;
  options?: Array<{ id: number; value: string }>;
}

// Product DTO (matches real API)
export interface ProductDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: number;
  parentCategoryId: number;
  brandId?: number;
  merchantId: number;
  statistics: ProductStatisticsDTO;
  brand?: BrandDTO;
  parentCategory: CategoryRefDTO;
  merchant: MerchantDTO;
  options: unknown[];
  variants: ProductVariantDTO[];
  createdAt?: string;
  updatedAt?: string;
}

// Cart Item DTO
export interface CartItemDTO {
  id: string;
  productId: number;
  variantId: number;
  quantity: number;
  isSelected: boolean;
  product?: ProductDTO;
  variant?: ProductVariantDTO;
}

// Cart DTO
export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  currency: string;
  updatedAt: string;
}

// User DTO
export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Response DTO
export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Pagination DTO (matches real API)
export interface PaginationDTO {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response wrapper
export interface ApiResponseDTO<T> {
  success: boolean;
  data: T;
  pagination?: PaginationDTO;
  categories?: CategoryDTO[];
}

// Paginated Response (for lists)
export interface PaginatedResponseDTO<T> {
  success: boolean;
  data: T[];
  pagination: PaginationDTO;
}

// API Error Response
export interface ApiErrorResponseDTO {
  statusCode: number;
  message: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
