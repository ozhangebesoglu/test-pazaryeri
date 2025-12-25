'use client';

import { ReactNode } from 'react';
import { Header, Footer, CartSidebar } from '../../organisms';
import { Category } from '@/core/domain/entities/Category';

interface MainLayoutProps {
  children: ReactNode;
  lang?: string;
  categories?: Category[];
}

/**
 * MainLayout Template
 * Main page layout with header, footer, and cart sidebar
 */
export function MainLayout({ children, lang = 'tr', categories = [] }: MainLayoutProps) {
  const categoryRefs = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header lang={lang} categories={categoryRefs} />
      <main className="flex-1 bg-white dark:bg-gray-950">{children}</main>
      <Footer lang={lang} />
      <CartSidebar lang={lang} />
    </div>
  );
}
