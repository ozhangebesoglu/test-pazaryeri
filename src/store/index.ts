import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import {
  createFavoritesSlice,
  FavoritesSlice,
  createCartSlice,
  CartSlice,
  createUISlice,
  UISlice,
  createAuthSlice,
  AuthSlice,
} from './slices';

/**
 * Combined App Store Type
 */
export type AppStore = FavoritesSlice & CartSlice & UISlice & AuthSlice;

/**
 * Zustand Store with Slices
 * Uses devtools for debugging and persist for local storage
 */
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createFavoritesSlice(...a),
        ...createCartSlice(...a),
        ...createUISlice(...a),
        ...createAuthSlice(...a),
      }),
      {
        name: 'pazaryeri-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Only persist these fields
          favorites: state.favorites,
          items: state.items,
          theme: state.theme,
        }),
      }
    ),
    { name: 'Pazaryeri Store' }
  )
);

// Export types
export type { FavoritesSlice, CartSlice, UISlice, AuthSlice };
export type { LocalCartItem } from './slices/cartSlice';
export type { Toast, ModalState } from './slices/uiSlice';

/**
 * Selector hooks for better performance
 */
export const useFavorites = () => useStore((state) => state.favorites);
export const useIsFavorite = (productId: string) =>
  useStore((state) => state.favorites.includes(productId));
export const useCartItems = () => useStore((state) => state.items);
export const useCartItemsCount = () => useStore((state) => state.getCartItemsCount());
export const useTheme = () => useStore((state) => state.theme);
export const useIsAuthenticated = () => useStore((state) => state.isAuthenticated);
export const useUser = () => useStore((state) => state.user);
