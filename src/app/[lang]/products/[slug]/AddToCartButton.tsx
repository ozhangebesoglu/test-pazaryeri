'use client';

import { Button, Icon } from '@/presentation/components/atoms';
import { useCart } from '@/presentation/hooks/useCart';
import { ProductSummary } from '@/core/domain/entities/Product';

interface AddToCartButtonProps {
  product: ProductSummary;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <Button
      size="lg"
      fullWidth
      disabled={disabled}
      onClick={() => addToCart(product)}
      leftIcon={<Icon name="cart" />}
      className="flex-1"
    >
      {inCart ? 'Sepete Eklendi' : 'Sepete Ekle'}
    </Button>
  );
}
