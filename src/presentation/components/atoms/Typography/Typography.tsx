import { ReactNode, ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Typography variants
 */
const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold tracking-tight lg:text-5xl',
      h2: 'text-3xl font-semibold tracking-tight',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-semibold',
      h6: 'text-base font-semibold',
      body: 'text-base',
      bodySmall: 'text-sm',
      caption: 'text-xs text-gray-500 dark:text-gray-400',
      lead: 'text-xl text-gray-600 dark:text-gray-300',
    },
    color: {
      default: 'text-gray-900 dark:text-gray-100',
      muted: 'text-gray-600 dark:text-gray-400',
      primary: 'text-primary-600 dark:text-primary-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});

/**
 * Default element map
 */
const defaultElementMap: Record<NonNullable<VariantProps<typeof typographyVariants>['variant']>, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
  lead: 'p',
};

/**
 * Typography Props
 */
export interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * Typography Component
 * Consistent text styling across the application
 */
export function Typography({
  children,
  variant = 'body',
  color,
  as,
  className,
}: TypographyProps) {
  const Component = as || (variant ? defaultElementMap[variant] : 'p');

  return (
    <Component className={cn(typographyVariants({ variant, color, className }))}>
      {children}
    </Component>
  );
}

export { typographyVariants };
