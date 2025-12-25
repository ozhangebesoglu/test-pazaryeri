import { StateCreator } from 'zustand';

/**
 * Favorites Slice
 * Manages product favorites state
 * Follows Slice Pattern for modular state management
 */
export interface FavoritesSlice {
  // State
  favorites: string[];

  // Actions
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  clearFavorites: () => void;

  // Selectors
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
}

export const createFavoritesSlice: StateCreator<
  FavoritesSlice,
  [],
  [],
  FavoritesSlice
> = (set, get) => ({
  // Initial state
  favorites: [],

  // Actions
  addFavorite: (productId) => {
    set((state) => {
      if (state.favorites.includes(productId)) {
        return state;
      }
      return { favorites: [...state.favorites, productId] };
    });
  },

  removeFavorite: (productId) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== productId),
    }));
  },

  toggleFavorite: (productId) => {
    const { favorites } = get();
    if (favorites.includes(productId)) {
      get().removeFavorite(productId);
    } else {
      get().addFavorite(productId);
    }
  },

  clearFavorites: () => {
    set({ favorites: [] });
  },

  // Selectors
  isFavorite: (productId) => {
    return get().favorites.includes(productId);
  },

  getFavoritesCount: () => {
    return get().favorites.length;
  },
});
