import Link from 'next/link';
import { Icon } from '../../atoms';

const translations = {
  tr: {
    description: "Türkiye'nin en güvenilir online alışveriş platformu. Binlerce ürün, uygun fiyatlar.",
    company: 'Kurumsal',
    support: 'Yardım',
    legal: 'Yasal',
    copyright: 'Tüm hakları saklıdır.',
    links: {
      company: [
        { label: 'Hakkımızda', href: '/about' },
        { label: 'Kariyer', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'İletişim', href: '/contact' },
      ],
      support: [
        { label: 'Yardım Merkezi', href: '/help' },
        { label: 'Sipariş Takibi', href: '/track-order' },
        { label: 'İade ve Değişim', href: '/returns' },
        { label: 'Kargo Bilgileri', href: '/shipping' },
      ],
      legal: [
        { label: 'Gizlilik Politikası', href: '/privacy' },
        { label: 'Kullanım Koşulları', href: '/terms' },
        { label: 'KVKK', href: '/kvkk' },
        { label: 'Çerez Politikası', href: '/cookies' },
      ],
    },
  },
  en: {
    description: "Turkey's most trusted online shopping platform. Thousands of products, affordable prices.",
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    copyright: 'All rights reserved.',
    links: {
      company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
      support: [
        { label: 'Help Center', href: '/help' },
        { label: 'Order Tracking', href: '/track-order' },
        { label: 'Returns & Exchanges', href: '/returns' },
        { label: 'Shipping Info', href: '/shipping' },
      ],
      legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Data Protection', href: '/kvkk' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  },
};

interface FooterProps {
  lang?: string;
}

/**
 * Footer Component
 * Site footer with links and information
 */
export function Footer({ lang = 'tr' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const t = translations[lang as keyof typeof translations] || translations.tr;

  const footerLinks = {
    company: t.links.company.map((link) => ({ ...link, href: `/${lang}${link.href}` })),
    support: t.links.support.map((link) => ({ ...link, href: `/${lang}${link.href}` })),
    legal: t.links.legal.map((link) => ({ ...link, href: `/${lang}${link.href}` })),
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href={`/${lang}`} className="inline-block">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Pazaryeri
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t.description}
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-primary-600"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-primary-600"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-primary-600"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t.company}</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t.support}</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t.legal}</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Pazaryeri. {t.copyright}
            </p>
            {/* Language Switcher */}
            <div className="flex gap-4">
              <Link
                href="/tr"
                className={`text-sm ${lang === 'tr' ? 'font-medium text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Türkçe
              </Link>
              <Link
                href="/en"
                className={`text-sm ${lang === 'en' ? 'font-medium text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                English
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
