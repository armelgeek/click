import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'mobile';
  onBackdropClick?: () => void;
}

export default function ResponsiveModal({
  children,
  open,
  className,
  maxWidth = 'md',
  onBackdropClick
}: ResponsiveModalProps) {
  if (!open) return null;

  const maxWidthClasses = {
    mobile: 'max-w-md',     // 448px - Mobile-first design, ideal for PWA
    sm: 'max-w-sm',         // 384px
    md: 'max-w-md',         // 448px
    lg: 'max-w-lg',         // 512px
    xl: 'max-w-xl',         // 576px
    '2xl': 'max-w-2xl',     // 672px
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onBackdropClick) {
      onBackdropClick();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-xl w-full',
          maxWidthClasses[maxWidth],
          'max-h-[90vh] overflow-y-auto',
          'mx-4 sm:mx-6',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}