'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button, Icon, Typography } from '../../atoms';
import { CartItem } from '../../molecules';
import { useCart } from '@/presentation/hooks/useCart';
import { formatMoney } from '@/lib/utils';

interface CartSidebarProps {
  lang?: string;
}

/**
 * CartSidebar Component
 * Slide-out cart panel
 */
export function CartSidebar({ lang = 'tr' }: CartSidebarProps) {
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700">
              <Typography variant="h5">Sepetim ({items.length})</Typography>
              <button onClick={closeCart} aria-label="Kapat">
                <Icon name="close" size="lg" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8">
                <Icon name="cart" size="xl" className="mb-4 text-gray-300" />
                <Typography variant="body" color="muted" className="mb-6 text-center">
                  Sepetiniz boş
                </Typography>
                <Button onClick={closeCart}>Alışverişe Başla</Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-auto px-4">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        lang={lang}
                        onUpdateQuantity={(qty) => updateQuantity(item.productId, qty)}
                        onRemove={() => removeFromCart(item.productId)}
                      />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="mb-4 text-sm text-gray-500 underline hover:text-red-500"
                  >
                    Sepeti Temizle
                  </button>

                  {/* Summary */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ara Toplam</span>
                      <span className="font-medium">{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Kargo</span>
                      <span className="font-medium text-green-600">Ücretsiz</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                      <span className="text-lg font-semibold">Toplam</span>
                      <span className="text-lg font-bold text-primary-600">{formatMoney(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link href={`/${lang}/checkout`} onClick={closeCart}>
                      <Button fullWidth size="lg">
                        Siparişi Tamamla
                      </Button>
                    </Link>
                    <Link href={`/${lang}/cart`} onClick={closeCart}>
                      <Button variant="outline" fullWidth>
                        Sepete Git
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
