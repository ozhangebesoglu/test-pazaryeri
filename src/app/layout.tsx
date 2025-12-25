import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/presentation/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pazaryeri - Online Alışveriş',
    template: '%s | Pazaryeri',
  },
  description: 'Türkiye\'nin en güvenilir online alışveriş platformu. Binlerce ürün, uygun fiyatlar.',
  keywords: ['e-ticaret', 'online alışveriş', 'pazaryeri', 'ürünler'],
  authors: [{ name: 'Pazaryeri' }],
  creator: 'Pazaryeri',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    siteName: 'Pazaryeri',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pazaryeri',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
