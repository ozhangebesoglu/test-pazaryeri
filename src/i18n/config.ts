import { Language, LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';

/**
 * i18n Configuration
 */
export const i18nConfig = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: LANGUAGES,
} as const;

/**
 * Check if locale is valid
 */
export function isValidLocale(locale: string): locale is Language {
  return LANGUAGES.includes(locale as Language);
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return pathname.replace(`/${locale}`, '') || '/';
}

/**
 * Add locale prefix to pathname
 */
export function addLocalePrefix(pathname: string, locale: Language): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/${locale}${cleanPath}`;
}
