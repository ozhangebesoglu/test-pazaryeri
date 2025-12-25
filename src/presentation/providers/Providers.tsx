'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ServiceProvider } from './ServiceProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined Providers Component
 * Wraps all necessary providers in correct order
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ServiceProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ServiceProvider>
    </QueryProvider>
  );
}
