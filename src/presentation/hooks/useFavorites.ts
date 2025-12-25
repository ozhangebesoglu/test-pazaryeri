'use client';

import { useCallback } from 'react';
import { useStore } from '@/store';

/**
 * Hook to manage favorites
 */
export function useFavorites() {
  const favorites = useStore((state) => state.favorites);
  const addFavorite = useStore((state) => state.addFavorite);
  const removeFavorite = useStore((state) => state.removeFavorite);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const clearFavorites = useStore((state) => state.clearFavorites);
  const isFavorite = useStore((state) => state.isFavorite);
  const getFavoritesCount = useStore((state) => state.getFavoritesCount);

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      toggleFavorite(productId);
    },
    [toggleFavorite]
  );

  const handleAddFavorite = useCallback(
    (productId: string) => {
      addFavorite(productId);
    },
    [addFavorite]
  );

  const handleRemoveFavorite = useCallback(
    (productId: string) => {
      removeFavorite(productId);
    },
    [removeFavorite]
  );

  return {
    // State
    favorites,
    count: getFavoritesCount(),

    // Actions
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    toggleFavorite: handleToggleFavorite,
    clearFavorites,

    // Selectors
    isFavorite,
  };
}

/**
 * Hook to check if a specific product is favorited
 */
export function useIsFavorite(productId: string): boolean {
  return useStore((state) => state.favorites.includes(productId));
}
