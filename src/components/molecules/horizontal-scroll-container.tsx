import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollSnap } from '@/hooks/use-scroll-snap';
import { cn } from '@/shared/lib/utils';

interface HorizontalScrollContainerProps {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  arrowClassName?: string;
  scrollAmount?: number;
}

/**
 * Enhanced horizontal scroll container with navigation arrows
 * Features:
 * - Smooth scrolling
 * - Navigation arrows that appear/disappear based on scroll position
 * - Mobile-friendly touch scrolling
 * - Keyboard navigation support
 */
export function HorizontalScrollContainer({
  children,
  className,
  showArrows = true,
  arrowClassName,
  scrollAmount = 300,
}: HorizontalScrollContainerProps) {
  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollBy,
  } = useScrollSnap({
    smooth: true,
    axis: 'x',
  });

  const handleScrollLeft = () => scrollBy(-scrollAmount);
  const handleScrollRight = () => scrollBy(scrollAmount);

  return (
    <div className="relative group">
      {/* Left arrow */}
      {showArrows && canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-10',
            'w-10 h-10 rounded-full bg-white shadow-lg',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:bg-gray-50 active:scale-95',
            'border border-gray-200',
            arrowClassName
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-4 overflow-x-auto scrollbar-hide',
          'scroll-smooth',
          'pb-2',
          // Add snap points for better UX
          'snap-x snap-mandatory',
          className
        )}
      >
        {children}
      </div>

      {/* Right arrow */}
      {showArrows && canScrollRight && (
        <button
          onClick={handleScrollRight}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 z-10',
            'w-10 h-10 rounded-full bg-white shadow-lg',
            'flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:bg-gray-50 active:scale-95',
            'border border-gray-200',
            arrowClassName
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
