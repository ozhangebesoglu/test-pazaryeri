'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useProductRepository } from '../providers/ServiceProvider';
import { GetProductsUseCase, GetProductBySlugUseCase, GetFeaturedProductsUseCase, SearchProductsUseCase } from '@/core/use-cases/products';
import { ProductFilters } from '@/core/domain/entities/Product';

/**
 * Query keys for products
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  featured: (limit?: number) => [...productKeys.all, 'featured', limit] as const,
  search: (query: string, filters?: ProductFilters) => [...productKeys.all, 'search', query, filters] as const,
  related: (productId: string) => [...productKeys.all, 'related', productId] as const,
};

/**
 * Hook to fetch products with filters
 */
export function useProducts(filters: ProductFilters = {}) {
  const productRepository = useProductRepository();

  const useCase = useMemo(
    () => new GetProductsUseCase(productRepository),
    [productRepository]
  );

  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => useCase.execute(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch single product by slug
 */
export function useProduct(slug: string) {
  const productRepository = useProductRepository();

  const useCase = useMemo(
    () => new GetProductBySlugUseCase(productRepository),
    [productRepository]
  );

  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => useCase.execute(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch featured products
 */
export function useFeaturedProducts(limit?: number) {
  const productRepository = useProductRepository();

  const useCase = useMemo(
    () => new GetFeaturedProductsUseCase(productRepository),
    [productRepository]
  );

  return useQuery({
    queryKey: productKeys.featured(limit),
    queryFn: () => useCase.execute(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to search products
 */
export function useProductSearch(query: string, filters: ProductFilters = {}) {
  const productRepository = useProductRepository();

  const useCase = useMemo(
    () => new SearchProductsUseCase(productRepository),
    [productRepository]
  );

  return useQuery({
    queryKey: productKeys.search(query, filters),
    queryFn: () => useCase.execute(query, filters),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes for search
  });
}

/**
 * Hook to fetch related products
 */
export function useRelatedProducts(productId: string, limit = 4) {
  const productRepository = useProductRepository();

  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => productRepository.findRelated(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to prefetch product
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  const productRepository = useProductRepository();

  return (slug: string) => {
    const useCase = new GetProductBySlugUseCase(productRepository);
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(slug),
      queryFn: () => useCase.execute(slug),
    });
  };
}
