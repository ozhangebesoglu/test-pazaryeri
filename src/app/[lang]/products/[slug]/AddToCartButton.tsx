'use client';

import { Button, Icon } from '@/presentation/components/atoms';
import { useCart } from '@/presentation/hooks/useCart';
import { ProductSummary } from '@/core/domain/entities/Product';

const translations = {
  tr: {
    addedToCart: 'Sepete Eklendi',
    addToCart: 'Sepete Ekle',
  },
  en: {
    addedToCart: 'Added to Cart',
    addToCart: 'Add to Cart',
  },
};

interface AddToCartButtonProps {
  product: ProductSummary;
  disabled?: boolean;
  lang?: string;
}

export function AddToCartButton({ product, disabled, lang = 'tr' }: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const t = translations[lang as keyof typeof translations] || translations.tr;

  return (
    <Button
      size="lg"
      fullWidth
      disabled={disabled}
      onClick={() => addToCart(product)}
      leftIcon={<Icon name="cart" />}
      className="flex-1"
    >
      {inCart ? t.addedToCart : t.addToCart}
    </Button>
  );
}
