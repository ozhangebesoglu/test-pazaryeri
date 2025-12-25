'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography, Button, Icon, Spinner } from '@/presentation/components/atoms';
import { ProductCard } from '@/presentation/components/molecules';
import { MainLayout } from '@/presentation/components/templates';
import { useStore } from '@/store';
import { ProductSummary } from '@/core/domain/entities/Product';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';

interface FavoritesPageProps {
  params: Promise<{ lang: string }>;
}

export default function FavoritesPage({ params }: FavoritesPageProps) {
  const { lang } = use(params);
  const favorites = useStore((state) => state.favorites);
  const clearFavorites = useStore((state) => state.clearFavorites);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteProducts() {
      if (favorites.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const client = getApiClient();
        const adapter = new ProductAdapter();
        const fetchedProducts: ProductSummary[] = [];

        // Fetch products by ID (in parallel)
        const promises = favorites.map(async (productId) => {
          try {
            const response = await client.get(ENDPOINTS.products.byId(productId));
            if (response.data?.data) {
              return adapter.toSummary(response.data.data);
            }
            return adapter.toSummary(response.data);
          } catch {
            // Product might have been deleted
            return null;
          }
        });

        const results = await Promise.all(promises);
        setProducts(results.filter((p): p is ProductSummary => p !== null));
      } catch (error) {
        console.error('Failed to fetch favorite products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteProducts();
  }, [favorites]);

  if (isLoading) {
    return (
      <MainLayout lang={lang}>
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (favorites.length === 0) {
    return (
      <MainLayout lang={lang}>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Icon name="heart" size="xl" className="text-gray-400" />
              </div>
            </div>
            <Typography variant="h2" className="mb-4">
              {lang === 'tr' ? 'Favori Listeniz Boş' : 'Your Favorites List is Empty'}
            </Typography>
            <Typography variant="body" color="muted" className="mb-8">
              {lang === 'tr'
                ? 'Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.'
                : 'Add products you like to your favorites to easily access them later.'}
            </Typography>
            <Link href={`/${lang}/products`}>
              <Button size="lg" leftIcon={<Icon name="search" />}>
                {lang === 'tr' ? 'Ürünleri Keşfet' : 'Explore Products'}
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout lang={lang}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Typography variant="h1" className="mb-2">
              {lang === 'tr' ? 'Favorilerim' : 'My Favorites'}
            </Typography>
            <Typography variant="body" color="muted">
              {products.length} {lang === 'tr' ? 'ürün' : 'products'}
            </Typography>
          </div>
          <button
            onClick={clearFavorites}
            className="text-sm text-gray-500 underline hover:text-red-500"
          >
            {lang === 'tr' ? 'Tümünü Temizle' : 'Clear All'}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
