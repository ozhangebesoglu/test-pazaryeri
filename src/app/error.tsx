'use client';

import { useEffect } from 'react';
import { Typography, Button, Icon } from '@/presentation/components/atoms';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary Page
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Icon name="close" size="xl" className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <Typography variant="h2" className="mb-4">
          Bir Hata Oluştu
        </Typography>
        <Typography variant="body" color="muted" className="mb-8 max-w-md">
          Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </Typography>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={reset}>
            Tekrar Dene
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => (window.location.href = '/tr')}
            leftIcon={<Icon name="home" />}
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
