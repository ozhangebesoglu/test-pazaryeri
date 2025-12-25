'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography, Button, Icon } from '@/presentation/components/atoms';
import { PriceDisplay } from '@/presentation/components/molecules';
import { MainLayout } from '@/presentation/components/templates';
import { useCart } from '@/presentation/hooks/useCart';
import { formatMoney } from '@/lib/utils';

interface CartPageProps {
  params: Promise<{ lang: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const { lang } = use(params);
  const {
    items,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <MainLayout lang={lang}>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Icon name="cart" size="xl" className="text-gray-400" />
              </div>
            </div>
            <Typography variant="h2" className="mb-4">
              {lang === 'tr' ? 'Sepetiniz Boş' : 'Your Cart is Empty'}
            </Typography>
            <Typography variant="body" color="muted" className="mb-8">
              {lang === 'tr'
                ? 'Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için ürünleri keşfedin.'
                : 'There are no items in your cart yet. Explore products to start shopping.'}
            </Typography>
            <Link href={`/${lang}/products`}>
              <Button size="lg" leftIcon={<Icon name="cart" />}>
                {lang === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
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
        <div className="mb-8 flex items-center justify-between">
          <Typography variant="h1">
            {lang === 'tr' ? 'Sepetim' : 'My Cart'} ({items.length})
          </Typography>
          <button
            onClick={clearCart}
            className="text-sm text-gray-500 underline hover:text-red-500"
          >
            {lang === 'tr' ? 'Sepeti Temizle' : 'Clear Cart'}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 p-4">
                  {/* Image */}
                  <Link
                    href={`/${lang}/products/${item.product.slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={item.product.image || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/${lang}/products/${item.product.slug}`}>
                          <Typography
                            variant="body"
                            className="font-medium hover:text-primary-600"
                          >
                            {item.product.name}
                          </Typography>
                        </Link>
                        <Typography variant="caption">
                          {item.product.merchant.name}
                        </Typography>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Kaldır"
                      >
                        <Icon name="trash" size="md" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => decrementQuantity(item.productId)}
                          disabled={item.quantity <= 1}
                          aria-label="Azalt"
                        >
                          <Icon name="minus" size="sm" />
                        </Button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => incrementQuantity(item.productId)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Artır"
                        >
                          <Icon name="plus" size="sm" />
                        </Button>
                      </div>

                      {/* Price */}
                      <PriceDisplay
                        price={{
                          amount: item.product.price.amount * item.quantity,
                          currency: item.product.price.currency,
                        }}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <Typography variant="h4" className="mb-6">
                {lang === 'tr' ? 'Sipariş Özeti' : 'Order Summary'}
              </Typography>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="body" color="muted">
                    {lang === 'tr' ? 'Ara Toplam' : 'Subtotal'}
                  </Typography>
                  <Typography variant="body" className="font-medium">
                    {formatMoney(subtotal)}
                  </Typography>
                </div>

                <div className="flex justify-between">
                  <Typography variant="body" color="muted">
                    {lang === 'tr' ? 'Kargo' : 'Shipping'}
                  </Typography>
                  <Typography variant="body" className="font-medium text-green-600">
                    {lang === 'tr' ? 'Ücretsiz' : 'Free'}
                  </Typography>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between">
                  <Typography variant="h5">
                    {lang === 'tr' ? 'Toplam' : 'Total'}
                  </Typography>
                  <Typography variant="h4" className="text-primary-600">
                    {formatMoney(total)}
                  </Typography>
                </div>
              </div>

              <Button size="lg" fullWidth className="mt-6">
                {lang === 'tr' ? 'Siparişi Tamamla' : 'Checkout'}
              </Button>

              <Link href={`/${lang}/products`} className="mt-4 block text-center">
                <Button variant="ghost" fullWidth>
                  {lang === 'tr' ? 'Alışverişe Devam Et' : 'Continue Shopping'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
