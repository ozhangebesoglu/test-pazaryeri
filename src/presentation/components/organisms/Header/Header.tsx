'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Icon, Badge } from '../../atoms';
import { SearchBar } from '../../molecules';
import { useStore, useCartItemsCount } from '@/store';
import { cn } from '@/lib/utils';

const translations = {
  tr: {
    menu: 'Menü',
    search: 'Ara',
    changeTheme: 'Tema değiştir',
    favorites: 'Favoriler',
    cart: 'Sepet',
    myAccount: 'Hesabım',
    viewAll: 'Tümünü Gör',
    switchToEnglish: 'Switch to English',
    switchToTurkish: "Türkçe'ye geç",
  },
  en: {
    menu: 'Menu',
    search: 'Search',
    changeTheme: 'Toggle theme',
    favorites: 'Favorites',
    cart: 'Cart',
    myAccount: 'My Account',
    viewAll: 'View All',
    switchToEnglish: 'Switch to English',
    switchToTurkish: 'Switch to Turkish',
  },
};

interface HeaderProps {
  lang?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

/**
 * Header Component
 * Main navigation header with search, cart, and user actions
 */
export function Header({ lang = 'tr', categories = [] }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cartItemsCount = useCartItemsCount();
  const toggleCart = useStore((state) => state.toggleCart);
  const favoritesCount = useStore((state) => state.getFavoritesCount());
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const t = translations[lang as keyof typeof translations] || translations.tr;

  const pathname = usePathname();

  // Prevent hydration mismatch by only showing badges after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get the alternate language path
  const getAlternateLangPath = () => {
    const newLang = lang === 'tr' ? 'en' : 'tr';
    if (pathname) {
      // Replace /tr/ or /en/ with the new language
      return pathname.replace(/^\/(tr|en)/, `/${newLang}`);
    }
    return `/${newLang}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t.menu}
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="lg" />
          </button>

          {/* Logo */}
          <Link href={`/${lang}`} className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Pazaryeri
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 px-8 lg:block">
            <SearchBar lang={lang} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label={t.search}
            >
              <Icon name="search" />
            </Button>

            {/* Language Toggle */}
            <Link href={getAlternateLangPath()}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={lang === 'tr' ? t.switchToEnglish : t.switchToTurkish}
                title={lang === 'tr' ? 'English' : 'Türkçe'}
              >
                <span className="text-sm font-semibold">
                  {lang === 'tr' ? 'EN' : 'TR'}
                </span>
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t.changeTheme}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </Button>

            {/* Favorites */}
            <Link href={`/${lang}/favorites`}>
              <Button variant="ghost" size="icon" className="relative" aria-label={t.favorites}>
                <Icon name="heart" />
                {isMounted && favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label={t.cart}
            >
              <Icon name="cart" />
              {isMounted && cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Button>

            {/* User */}
            <Link href={`/${lang}/account`}>
              <Button variant="ghost" size="icon" aria-label={t.myAccount}>
                <Icon name="user" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4 lg:hidden"
            >
              <SearchBar lang={lang} onClose={() => setIsSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories Nav */}
      <nav className="hidden border-t border-gray-100 dark:border-gray-800 lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 overflow-x-auto py-3">
            {categories.slice(0, 8).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/${lang}/categories/${category.slug}`}
                  className="whitespace-nowrap text-sm font-medium text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${lang}/categories`}
                className="whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400"
              >
                {t.viewAll}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 top-16 z-50 bg-white dark:bg-gray-900 lg:hidden"
          >
            <nav className="container mx-auto px-4 py-6">
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/${lang}/categories/${category.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
