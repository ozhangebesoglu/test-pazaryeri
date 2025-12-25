'use client';

import { Button, Icon } from '@/presentation/components/atoms';
import { useFavorites } from '@/presentation/hooks/useFavorites';

interface FavoriteButtonProps {
  productId: string;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={() => toggleFavorite(productId)}
      aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Icon
        name={favorite ? 'heartFilled' : 'heart'}
        className={favorite ? 'text-red-500' : ''}
      />
    </Button>
  );
}
