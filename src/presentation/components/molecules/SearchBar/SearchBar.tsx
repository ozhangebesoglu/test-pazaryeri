'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Icon, Button, Spinner } from '../../atoms';
import { useProductSearch } from '@/presentation/hooks/useProducts';
import { debounce, cn, formatMoney } from '@/lib/utils';

const translations = {
  tr: {
    placeholder: 'Ürün, kategori veya marka ara...',
    viewAllResults: 'Tüm sonuçları gör',
    noResults: 'Sonuç bulunamadı',
  },
  en: {
    placeholder: 'Search products, categories or brands...',
    viewAllResults: 'View all results',
    noResults: 'No results found',
  },
};

interface SearchBarProps {
  lang?: string;
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

/**
 * SearchBar Component
 * Search input with autocomplete dropdown
 */
export function SearchBar({
  lang = 'tr',
  placeholder,
  className,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const t = translations[lang as keyof typeof translations] || translations.tr;
  const searchPlaceholder = placeholder || t.placeholder;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useProductSearch(debouncedQuery);

  // Debounce search query
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleProductClick = (slug: string) => {
    router.push(`/${lang}/products/${slug}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={searchPlaceholder}
          leftIcon={<Icon name="search" size="md" />}
          rightIcon={
            query ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" size="sm" />
              </button>
            ) : undefined
          }
          fullWidth
        />
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.data.slice(0, 5).map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleProductClick(product.slug)}
                      className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-primary-600 dark:text-primary-400">
                          {formatMoney(product.price)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
                {data.pagination.total > 5 && (
                  <li>
                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                      className="justify-center"
                    >
                      {t.viewAllResults} ({data.pagination.total})
                    </Button>
                  </li>
                )}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                {t.noResults}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
