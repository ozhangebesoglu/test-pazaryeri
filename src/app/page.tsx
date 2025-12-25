import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/constants';

/**
 * Root page redirects to default language
 */
export default function RootPage() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
