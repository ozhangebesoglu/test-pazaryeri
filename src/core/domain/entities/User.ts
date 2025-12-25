/**
 * User Role
 */
export type UserRole = 'customer' | 'merchant' | 'admin';

/**
 * User Entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Session (authenticated user info)
 */
export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

/**
 * Address Entity
 */
export interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryId: string;
  regionId: string;
  city: string;
  district: string;
  neighborhood?: string;
  addressLine: string;
  postalCode?: string;
  isDefault: boolean;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: UserSession | null): session is UserSession {
  if (!session) return false;
  return new Date() < session.expiresAt;
}

/**
 * Check if user has role
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

/**
 * Get user initials
 */
export function getUserInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
