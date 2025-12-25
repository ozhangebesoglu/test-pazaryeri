import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Language, LANGUAGES } from '@/lib/constants';

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * Language-specific layout
 * Validates language parameter and provides context
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  // Validate language
  if (!LANGUAGES.includes(lang as Language)) {
    notFound();
  }

  return <>{children}</>;
}

/**
 * Generate static params for all supported languages
 */
export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}
