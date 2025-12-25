import { createCartSlice, CartSlice, LocalCartItem } from '../cartSlice';
import { ProductSummary } from '@/core/domain/entities/Product';

// Mock product for testing
const mockProduct: ProductSummary = {
  id: 'product-1',
  slug: 'test-product',
  name: 'Test Product',
  price: { amount: 100, currency: 'TRY' },
  image: '/test.jpg',
  rating: 4.5,
  reviewCount: 10,
  merchant: { id: 'merchant-1', name: 'Test Merchant' },
  stock: 50,
  isFeatured: false,
};

const mockProduct2: ProductSummary = {
  id: 'product-2',
  slug: 'test-product-2',
  name: 'Test Product 2',
  price: { amount: 200, currency: 'TRY' },
  image: '/test2.jpg',
  rating: 4.0,
  reviewCount: 5,
  merchant: { id: 'merchant-1', name: 'Test Merchant' },
  stock: 30,
  isFeatured: false,
};

// Create a test store
function createTestStore() {
  let state: CartSlice;

  const setState = (partial: Partial<CartSlice> | ((state: CartSlice) => Partial<CartSlice>)) => {
    const newState = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...newState };
  };

  const getState = () => state;

  state = createCartSlice(setState as never, getState as never, {} as never);

  return { getState, setState };
}

describe('cartSlice', () => {
  describe('addToCart', () => {
    it('should add new product to cart', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);

      expect(getState().items).toHaveLength(1);
      expect(getState().items[0].productId).toBe('product-1');
      expect(getState().items[0].quantity).toBe(1);
      expect(getState().items[0].isSelected).toBe(true);
    });

    it('should increase quantity for existing product', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().addToCart(mockProduct, 2);

      expect(getState().items).toHaveLength(1);
      expect(getState().items[0].quantity).toBe(3);
    });

    it('should add different products separately', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().addToCart(mockProduct2, 1);

      expect(getState().items).toHaveLength(2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().removeFromCart('product-1');

      expect(getState().items).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().updateQuantity('product-1', 5);

      expect(getState().items[0].quantity).toBe(5);
    });

    it('should remove product when quantity is 0 or less', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().updateQuantity('product-1', 0);

      expect(getState().items).toHaveLength(0);
    });
  });

  describe('toggleItemSelection', () => {
    it('should toggle item selection', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      expect(getState().items[0].isSelected).toBe(true);

      getState().toggleItemSelection('product-1');
      expect(getState().items[0].isSelected).toBe(false);

      getState().toggleItemSelection('product-1');
      expect(getState().items[0].isSelected).toBe(true);
    });
  });

  describe('selectAllItems', () => {
    it('should select all items', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().addToCart(mockProduct2, 1);
      getState().toggleItemSelection('product-1'); // Deselect first

      getState().selectAllItems(true);

      expect(getState().items.every(item => item.isSelected)).toBe(true);
    });

    it('should deselect all items', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().addToCart(mockProduct2, 1);

      getState().selectAllItems(false);

      expect(getState().items.every(item => !item.isSelected)).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);
      getState().addToCart(mockProduct2, 1);
      getState().clearCart();

      expect(getState().items).toHaveLength(0);
    });
  });

  describe('getCartItemsCount', () => {
    it('should return total items count', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 2);
      getState().addToCart(mockProduct2, 3);

      expect(getState().getCartItemsCount()).toBe(5);
    });
  });

  describe('getSelectedItemsCount', () => {
    it('should return selected items count', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 2);
      getState().addToCart(mockProduct2, 3);
      getState().toggleItemSelection('product-1'); // Deselect first

      expect(getState().getSelectedItemsCount()).toBe(3);
    });
  });

  describe('getCartSubtotal', () => {
    it('should calculate subtotal for selected items', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 2); // 2 * 100 = 200
      getState().addToCart(mockProduct2, 1); // 1 * 200 = 200

      const subtotal = getState().getCartSubtotal();
      expect(subtotal.amount).toBe(400);
      expect(subtotal.currency).toBe('TRY');
    });

    it('should return zero for empty cart', () => {
      const { getState } = createTestStore();

      const subtotal = getState().getCartSubtotal();
      expect(subtotal.amount).toBe(0);
    });
  });

  describe('isInCart', () => {
    it('should return true if product is in cart', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 1);

      expect(getState().isInCart('product-1')).toBe(true);
      expect(getState().isInCart('product-2')).toBe(false);
    });
  });

  describe('getCartItem', () => {
    it('should return cart item by product id', () => {
      const { getState } = createTestStore();

      getState().addToCart(mockProduct, 2);

      const item = getState().getCartItem('product-1');
      expect(item).toBeDefined();
      expect(item?.quantity).toBe(2);
    });

    it('should return undefined for non-existent product', () => {
      const { getState } = createTestStore();

      const item = getState().getCartItem('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('cart open state', () => {
    it('should toggle cart open state', () => {
      const { getState } = createTestStore();

      expect(getState().isCartOpen).toBe(false);

      getState().toggleCart();
      expect(getState().isCartOpen).toBe(true);

      getState().toggleCart();
      expect(getState().isCartOpen).toBe(false);
    });

    it('should set cart open state', () => {
      const { getState } = createTestStore();

      getState().setCartOpen(true);
      expect(getState().isCartOpen).toBe(true);

      getState().setCartOpen(false);
      expect(getState().isCartOpen).toBe(false);
    });
  });
});
