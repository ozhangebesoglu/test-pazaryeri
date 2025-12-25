'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCategoryRepository } from '../providers/ServiceProvider';
import { GetCategoriesUseCase, GetCategoryBySlugUseCase } from '@/core/use-cases/categories';

/**
 * Query keys for categories
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  roots: () => [...categoryKeys.all, 'roots'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  const categoryRepository = useCategoryRepository();

  const useCase = useMemo(
    () => new GetCategoriesUseCase(categoryRepository),
    [categoryRepository]
  );

  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories rarely change)
  });
}

/**
 * Hook to fetch categories as tree
 */
export function useCategoryTree() {
  const categoryRepository = useCategoryRepository();

  const useCase = useMemo(
    () => new GetCategoriesUseCase(categoryRepository),
    [categoryRepository]
  );

  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => useCase.executeAsTree(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch root categories
 */
export function useRootCategories() {
  const categoryRepository = useCategoryRepository();

  const useCase = useMemo(
    () => new GetCategoriesUseCase(categoryRepository),
    [categoryRepository]
  );

  return useQuery({
    queryKey: categoryKeys.roots(),
    queryFn: () => useCase.executeRoots(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch single category with breadcrumbs
 */
export function useCategory(slug: string) {
  const categoryRepository = useCategoryRepository();

  const useCase = useMemo(
    () => new GetCategoryBySlugUseCase(categoryRepository),
    [categoryRepository]
  );

  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => useCase.execute(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
