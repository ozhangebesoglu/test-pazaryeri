// Product
export type {
  Product,
  ProductSummary,
  ProductFilters,
  ProductStatus,
  ProductImage,
  ProductVariant,
  CategoryRef,
  BrandRef,
  MerchantRef,
} from './Product';
export { getDiscountPercentage, isInStock } from './Product';

// Category
export type {
  Category,
  CategoryParent,
  CategoryTreeNode,
  CategoryBreadcrumb,
} from './Category';
export { buildBreadcrumbs, findCategoryBySlug, flattenCategoryTree } from './Category';

// Cart
export type {
  Cart,
  CartItem,
  CartSummary,
  AddToCartRequest,
  UpdateCartItemRequest,
} from './Cart';
export {
  calculateItemTotal,
  calculateCartSubtotal,
  getSelectedItemsCount,
  areAllItemsSelected,
} from './Cart';

// User
export type {
  User,
  UserRole,
  UserSession,
  Address,
  LoginRequest,
  RegisterRequest,
} from './User';
export { isAuthenticated, hasRole, getUserInitials } from './User';
