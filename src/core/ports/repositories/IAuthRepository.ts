import { User, UserSession, LoginRequest, RegisterRequest } from '../../domain/entities/User';

/**
 * Auth Repository Interface
 * Defines the contract for authentication operations
 */
export interface IAuthRepository {
  /**
   * Login with email and password
   */
  login(request: LoginRequest): Promise<UserSession>;

  /**
   * Register new user
   */
  register(request: RegisterRequest): Promise<UserSession>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get current session
   */
  getSession(): Promise<UserSession | null>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<UserSession>;

  /**
   * Check if email is available
   */
  checkEmail(email: string): Promise<boolean>;

  /**
   * Request password reset
   */
  forgotPassword(email: string): Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Get current user profile
   */
  getProfile(): Promise<User>;

  /**
   * Update user avatar
   */
  updateAvatar(file: File): Promise<User>;
}
