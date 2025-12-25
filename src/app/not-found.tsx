import Link from 'next/link';
import { Typography, Button, Icon } from '@/presentation/components/atoms';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
        <Typography variant="h2" className="mb-4">
          Sayfa Bulunamadı
        </Typography>
        <Typography variant="body" color="muted" className="mb-8 max-w-md">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </Typography>
        <Link href="/tr">
          <Button size="lg" leftIcon={<Icon name="home" />}>
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
