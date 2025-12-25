/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const ENDPOINTS = {
  // Products
  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/slug/${slug}`,
    statistics: '/products/statistics',
    comments: (id: string) => `/products/${id}/comments`,
  },

  // Categories
  categories: {
    list: '/categories',
    byId: (id: string) => `/categories/${id}`,
    bySlug: (slug: string) => `/categories/slug/${slug}`,
  },

  // Brands
  brands: {
    list: '/brands',
    byId: (id: string) => `/brands/${id}`,
  },

  // Cart
  cart: {
    get: '/cart',
    add: '/cart',
    updateItem: (itemId: string) => `/cart/item/${itemId}`,
    toggleItem: (itemId: string) => `/cart/item/${itemId}`,
    removeItem: (itemId: string) => `/cart/item/${itemId}`,
    clear: '/cart/clear',
    selectAll: '/cart/select-all',
  },

  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
    checkEmail: '/auth/check-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Session
  session: {
    profile: '/session',
    updateAvatar: '/session/update-avatar',
    orders: '/session/orders',
    orderById: (id: string) => `/session/orders/${id}`,
  },

  // Merchants
  merchants: {
    byId: (id: string) => `/merchants/${id}`,
    follow: (id: string) => `/merchants/${id}/following`,
  },

  // Member Collections (Favorites)
  collections: {
    list: '/member-collections',
    create: '/member-collections',
    byId: (id: string) => `/member-collections/${id}`,
    addProducts: (id: string) => `/member-collections/${id}/products`,
    removeProduct: (id: string, productId: string) =>
      `/member-collections/${id}/products/${productId}`,
  },

  // Utility
  init: '/init/application',
} as const;
