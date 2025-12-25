import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Language } from '@/lib/constants';
import { getDictionary } from '@/i18n';
import { Typography, Button, Icon, Badge } from '@/presentation/components/atoms';
import { PriceDisplay, ProductCard } from '@/presentation/components/molecules';
import { MainLayout } from '@/presentation/components/templates';
import { getApiClient } from '@/infrastructure/api/client';
import { ProductAdapter, CategoryAdapter } from '@/infrastructure/adapters';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import { isInStock, getDiscountPercentage } from '@/core/domain/entities/Product';
import { AddToCartButton } from './AddToCartButton';
import { FavoriteButton } from './FavoriteButton';

interface ProductPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getProductData(slug: string) {
  const client = getApiClient();
  const productAdapter = new ProductAdapter();
  const categoryAdapter = new CategoryAdapter();

  try {
    const [productRes, categoriesRes] = await Promise.all([
      client.get(ENDPOINTS.products.bySlug(slug)),
      client.get(ENDPOINTS.categories.list),
    ]);

    const product = productAdapter.toEntity(productRes.data);

    // Get related products
    let relatedProducts: ReturnType<typeof productAdapter.toSummary>[] = [];
    try {
      const relatedRes = await client.get(ENDPOINTS.products.list, {
        params: { categoryId: product.category.id, limit: 5 },
      });
      relatedProducts = relatedRes.data.data
        ?.filter((p: { id: string }) => p.id !== product.id)
        .slice(0, 4)
        .map((p: unknown) => productAdapter.toSummary(p as Parameters<typeof productAdapter.toSummary>[0])) || [];
    } catch {}

    return {
      product,
      relatedProducts,
      categories: categoryAdapter.toEntityList(categoriesRes.data || []),
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return { title: 'Product Not Found' };
  }

  const { product } = data;

  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt || product.name,
      })),
    },
  };
}

export const revalidate = 300; // ISR - 5 minutes

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts, categories } = data;
  const dict = await getDictionary(lang as Language);
  const inStock = isInStock(product);
  const discount = getDiscountPercentage(product);

  // Prepare product summary for cart
  const productSummary = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.images[0]?.url || '',
    rating: product.rating,
    reviewCount: product.reviewCount,
    merchant: { id: product.merchant.id, name: product.merchant.name },
    stock: product.stock,
    isFeatured: product.isFeatured,
  };

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    image: product.images.map((img) => img.url),
    sku: product.sku,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand.name,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: `https://pazaryeri.com/${lang}/products/${product.slug}`,
      priceCurrency: 'TRY',
      price: product.price.amount,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.merchant.name,
      },
    },
    aggregateRating:
      product.rating > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <MainLayout lang={lang} categories={categories}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href={`/${lang}`} className="hover:text-primary-600">
            {dict.nav.home}
          </a>
          <span className="mx-2">/</span>
          <a href={`/${lang}/categories/${product.category.slug}`} className="hover:text-primary-600">
            {product.category.name}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.images[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
              {discount && (
                <Badge variant="danger" size="lg" className="absolute left-4 top-4">
                  %{discount} İndirim
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} - ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            {product.brand && (
              <Typography variant="caption" className="mb-2 uppercase tracking-wider">
                {product.brand.name}
              </Typography>
            )}

            {/* Title */}
            <Typography variant="h1" className="mb-4">
              {product.name}
            </Typography>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= Math.round(product.rating) ? 'starFilled' : 'star'}
                      size="md"
                      className={
                        star <= Math.round(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} {dict.product.reviews})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                size="lg"
              />
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <Badge variant="success" size="md">
                  <Icon name="check" size="sm" className="mr-1" />
                  {dict.product.inStock} ({product.stock})
                </Badge>
              ) : (
                <Badge variant="danger" size="md">
                  {dict.product.outOfStock}
                </Badge>
              )}
            </div>

            {/* Merchant */}
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <Typography variant="bodySmall" color="muted">
                {lang === 'tr' ? 'Satıcı:' : 'Seller:'}
              </Typography>
              <Typography variant="body" className="font-medium">
                {product.merchant.name}
              </Typography>
              {product.merchant.rating && (
                <div className="flex items-center gap-1">
                  <Icon name="starFilled" size="sm" className="text-yellow-400" />
                  <span className="text-sm">{product.merchant.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <AddToCartButton product={productSummary} disabled={!inStock} />
              <FavoriteButton productId={product.id} />
            </div>

            {/* Free Shipping */}
            <div className="mt-6 flex items-center gap-2 text-green-600">
              <Icon name="check" size="md" />
              <span className="font-medium">{dict.product.freeShipping}</span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <Typography variant="h4" className="mb-4">
                {dict.product.description}
              </Typography>
              <div
                className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <Typography variant="h2" className="mb-6">
              {dict.product.relatedProducts}
            </Typography>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
