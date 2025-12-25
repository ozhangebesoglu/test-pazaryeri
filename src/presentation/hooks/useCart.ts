'use client';

import { useCallback } from 'react';
import { useStore } from '@/store';
import { ProductSummary } from '@/core/domain/entities/Product';

/**
 * Hook to manage cart operations
 * Uses local Zustand store for cart management
 */
export function useCart() {
  const items = useStore((state) => state.items);
  const isCartOpen = useStore((state) => state.isCartOpen);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const toggleItemSelection = useStore((state) => state.toggleItemSelection);
  const selectAllItems = useStore((state) => state.selectAllItems);
  const clearCart = useStore((state) => state.clearCart);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const toggleCart = useStore((state) => state.toggleCart);
  const getCartItemsCount = useStore((state) => state.getCartItemsCount);
  const getCartSubtotal = useStore((state) => state.getCartSubtotal);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const isInCart = useStore((state) => state.isInCart);
  const getCartItem = useStore((state) => state.getCartItem);

  const handleAddToCart = useCallback(
    (product: ProductSummary, quantity = 1, variantId?: string) => {
      addToCart(product, quantity, variantId);
      // Optionally open cart sidebar
      setCartOpen(true);
    },
    [addToCart, setCartOpen]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      removeFromCart(productId);
    },
    [removeFromCart]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const incrementQuantity = useCallback(
    (productId: string) => {
      const item = getCartItem(productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
      }
    },
    [getCartItem, updateQuantity]
  );

  const decrementQuantity = useCallback(
    (productId: string) => {
      const item = getCartItem(productId);
      if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1);
      }
    },
    [getCartItem, updateQuantity]
  );

  return {
    // State
    items,
    isCartOpen,
    itemsCount: getCartItemsCount(),
    subtotal: getCartSubtotal(),
    total: getCartTotal(),

    // Actions
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    incrementQuantity,
    decrementQuantity,
    toggleItemSelection,
    selectAllItems,
    clearCart,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    toggleCart,

    // Selectors
    isInCart,
    getCartItem,
  };
}
