/**
 * Paginated Result Type
 * Generic pagination wrapper
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Pagination Metadata
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Create success result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Create failure result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Sort Direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort Option
 */
export interface SortOption<T extends string = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Date Range
 */
export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Deep Partial type helper
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
