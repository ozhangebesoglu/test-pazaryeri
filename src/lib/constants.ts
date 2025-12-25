// API Configuration
export const API_BASE_URL = 'https://api.meshur.co/api';
export const API_TIMEOUT = 10000;

// Supported Languages
export const LANGUAGES = ['tr', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'tr';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache Times (in milliseconds)
export const CACHE_TIMES = {
  products: 5 * 60 * 1000, // 5 minutes
  categories: 30 * 60 * 1000, // 30 minutes
  brands: 60 * 60 * 1000, // 1 hour
} as const;

// ISR Revalidation (in seconds)
export const REVALIDATE_TIMES = {
  homepage: 60, // 1 minute
  productDetail: 300, // 5 minutes
  categoryPage: 600, // 10 minutes
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  favorites: 'pazaryeri-favorites',
  cart: 'pazaryeri-cart',
  theme: 'pazaryeri-theme',
  language: 'pazaryeri-language',
} as const;

// Theme
export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];
