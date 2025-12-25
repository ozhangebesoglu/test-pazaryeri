import { StateCreator } from 'zustand';
import { ProductSummary, MoneyValue } from '@/core/domain/entities/Product';

/**
 * Local Cart Item (client-side)
 */
export interface LocalCartItem {
  productId: string;
  product: ProductSummary;
  quantity: number;
  variantId?: string;
  isSelected: boolean;
  addedAt: Date;
}

/**
 * Cart Slice
 * Manages shopping cart state (client-side)
 */
export interface CartSlice {
  // State
  items: LocalCartItem[];
  isCartOpen: boolean;

  // Actions
  addToCart: (product: ProductSummary, quantity?: number, variantId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleItemSelection: (productId: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;

  // Selectors
  getCartItemsCount: () => number;
  getSelectedItemsCount: () => number;
  getCartSubtotal: () => MoneyValue;
  getCartTotal: () => MoneyValue;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => LocalCartItem | undefined;
}

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set, get) => ({
  // Initial state
  items: [],
  isCartOpen: false,

  // Actions
  addToCart: (product, quantity = 1, variantId) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex >= 0) {
        // Update quantity
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { items: newItems };
      }

      // Add new item
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            product,
            quantity,
            variantId,
            isSelected: true,
            addedAt: new Date(),
          },
        ],
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  toggleItemSelection: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, isSelected: !item.isSelected } : item
      ),
    }));
  },

  selectAllItems: (selected) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, isSelected: selected })),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setCartOpen: (open) => {
    set({ isCartOpen: open });
  },

  toggleCart: () => {
    set((state) => ({ isCartOpen: !state.isCartOpen }));
  },

  // Selectors
  getCartItemsCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },

  getSelectedItemsCount: () => {
    return get()
      .items.filter((item) => item.isSelected)
      .reduce((count, item) => count + item.quantity, 0);
  },

  getCartSubtotal: () => {
    const items = get().items.filter((item) => item.isSelected);
    if (items.length === 0) {
      return { amount: 0, currency: 'TRY' };
    }

    const totalAmount = items.reduce(
      (total, item) => total + item.product.price.amount * item.quantity,
      0
    );

    return { amount: totalAmount, currency: 'TRY' };
  },

  getCartTotal: () => {
    // For now, total equals subtotal. Add shipping/discounts later
    return get().getCartSubtotal();
  },

  isInCart: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },

  getCartItem: (productId) => {
    return get().items.find((item) => item.productId === productId);
  },
});
