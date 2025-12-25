'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { AxiosInstance } from 'axios';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter, CategoryAdapter, CartAdapter } from '@/infrastructure/adapters';
import {
  ProductRepository,
  CategoryRepository,
  CartRepository,
} from '@/infrastructure/repositories';
import { IProductRepository } from '@/core/ports/repositories/IProductRepository';
import { ICategoryRepository } from '@/core/ports/repositories/ICategoryRepository';
import { ICartRepository } from '@/core/ports/repositories/ICartRepository';

/**
 * Service Container Interface
 * Defines all available services (DIP)
 */
export interface ServiceContainer {
  productRepository: IProductRepository;
  categoryRepository: ICategoryRepository;
  cartRepository: ICartRepository;
}

/**
 * Service Context
 */
const ServiceContext = createContext<ServiceContainer | null>(null);

/**
 * Factory function to create service container
 * Implements Factory Pattern for object creation
 */
function createServiceContainer(apiClient: AxiosInstance): ServiceContainer {
  // Create adapters
  const productAdapter = new ProductAdapter();
  const categoryAdapter = new CategoryAdapter();
  const cartAdapter = new CartAdapter();

  // Create repositories with dependency injection
  const productRepository = new ProductRepository(apiClient, productAdapter);
  const categoryRepository = new CategoryRepository(apiClient, categoryAdapter);
  const cartRepository = new CartRepository(apiClient, cartAdapter);

  return {
    productRepository,
    categoryRepository,
    cartRepository,
  };
}

/**
 * Service Provider Props
 */
interface ServiceProviderProps {
  children: ReactNode;
}

/**
 * Service Provider Component
 * Provides dependency injection container to the app
 */
export function ServiceProvider({ children }: ServiceProviderProps) {
  const services = useMemo(() => {
    const apiClient = getApiClient();
    return createServiceContainer(apiClient);
  }, []);

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
}

/**
 * Hook to access services
 * Throws if used outside ServiceProvider
 */
export function useServices(): ServiceContainer {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }

  return context;
}

/**
 * Individual service hooks for convenience
 */
export function useProductRepository(): IProductRepository {
  return useServices().productRepository;
}

export function useCategoryRepository(): ICategoryRepository {
  return useServices().categoryRepository;
}

export function useCartRepository(): ICartRepository {
  return useServices().cartRepository;
}
