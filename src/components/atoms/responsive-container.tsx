import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'mobile';
  centerOnDesktop?: boolean;
}

/**
 * Responsive container component that provides optimal layout for mobile-first PWA
 * with desktop optimization
 */
export default function ResponsiveContainer({
  children,
  className,
  maxWidth = 'mobile',
  centerOnDesktop = true
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    mobile: 'max-w-md',     // Mobile-first design, ideal for PWA
    sm: 'max-w-sm',         // 384px
    md: 'max-w-md',         // 448px
    lg: 'max-w-lg',         // 512px
    xl: 'max-w-xl',         // 576px
    '2xl': 'max-w-2xl',     // 672px
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        centerOnDesktop && 'mx-auto',
        // Responsive padding
        'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}