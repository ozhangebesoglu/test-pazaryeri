'use client';

import { Button, Icon } from '@/presentation/components/atoms';
import { useFavorites } from '@/presentation/hooks/useFavorites';

const translations = {
  tr: {
    removeFromFavorites: 'Favorilerden çıkar',
    addToFavorites: 'Favorilere ekle',
  },
  en: {
    removeFromFavorites: 'Remove from favorites',
    addToFavorites: 'Add to favorites',
  },
};

interface FavoriteButtonProps {
  productId: string;
  lang?: string;
}

export function FavoriteButton({ productId, lang = 'tr' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);
  const t = translations[lang as keyof typeof translations] || translations.tr;

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={() => toggleFavorite(productId)}
      aria-label={favorite ? t.removeFromFavorites : t.addToFavorites}
    >
      <Icon
        name={favorite ? 'heartFilled' : 'heart'}
        className={favorite ? 'text-red-500' : ''}
      />
    </Button>
  );
}
