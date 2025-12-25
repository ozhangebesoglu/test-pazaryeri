import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants';

/**
 * API Client Error
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Create axios instance with default config
 */
function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message: string; errors?: Array<{ field: string; message: string }> }>) => {
      if (error.response) {
        const { status, data } = error.response;
        throw new ApiClientError(data?.message || 'An error occurred', status, data?.errors);
      }
      if (error.request) {
        throw new ApiClientError('Network error. Please check your connection.', 0);
      }
      throw new ApiClientError(error.message || 'An unexpected error occurred', 0);
    }
  );

  return instance;
}

/**
 * Singleton API client instance
 */
let apiClientInstance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!apiClientInstance) {
    apiClientInstance = createAxiosInstance();
  }
  return apiClientInstance;
}

/**
 * Create a new API client (for testing or custom configs)
 */
export function createApiClient(baseURL?: string): AxiosInstance {
  const instance = createAxiosInstance();
  if (baseURL) {
    instance.defaults.baseURL = baseURL;
  }
  return instance;
}

/**
 * Set auth token
 */
export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
}

/**
 * Clear auth token
 */
export function clearAuthToken(): void {
  setAuthToken(null);
}
