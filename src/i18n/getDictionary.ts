import { Language } from '@/lib/constants';

/**
 * Dictionary Type
 */
export interface Dictionary {
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    searchPlaceholder: string;
    noResults: string;
    seeAll: string;
    backToHome: string;
  };
  nav: {
    home: string;
    categories: string;
    products: string;
    cart: string;
    favorites: string;
    account: string;
    login: string;
    register: string;
    logout: string;
  };
  product: {
    addToCart: string;
    addToFavorites: string;
    removeFromFavorites: string;
    inStock: string;
    outOfStock: string;
    freeShipping: string;
    reviews: string;
    description: string;
    specifications: string;
    relatedProducts: string;
  };
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    subtotal: string;
    shipping: string;
    total: string;
    checkout: string;
    remove: string;
    quantity: string;
  };
  errors: {
    notFound: string;
    notFoundDescription: string;
    serverError: string;
    serverErrorDescription: string;
  };
  footer: {
    aboutUs: string;
    contact: string;
    help: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
}

/**
 * Import dictionary for locale
 */
const dictionaries: Record<Language, () => Promise<Dictionary>> = {
  tr: () => import('./locales/tr.json').then((module) => module.default as Dictionary),
  en: () => import('./locales/en.json').then((module) => module.default as Dictionary),
};

/**
 * Get dictionary for locale
 */
export async function getDictionary(locale: Language): Promise<Dictionary> {
  const loadDictionary = dictionaries[locale] || dictionaries.tr;
  return loadDictionary();
}
