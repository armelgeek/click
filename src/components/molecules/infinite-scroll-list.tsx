import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { cn } from '@/shared/lib/utils';

interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
  gridCols?: 2 | 3 | 4;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  keyExtractor?: (item: T, index: number) => string;
}

/**
 * Infinite scroll list component with automatic loading
 * Features:
 * - Automatic loading when scrolling near bottom
 * - Customizable grid layout
 * - Loading and empty states
 * - Optimized performance with intersection observer
 */
export function InfiniteScrollList<T>({
  items,
  renderItem,
  onLoadMore,
  hasMore,
  isLoading,
  className,
  gridCols = 3,
  loadingComponent,
  emptyComponent,
  keyExtractor,
}: InfiniteScrollListProps<T>) {
  const sentinelRef = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
    rootMargin: '200px',
  });

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[gridCols];

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center mb-5 py-8">
      <Loader2 className="w-8 h-8 animate-spin text-vapo-purple-primary" />
    </div>
  );

  const defaultEmptyComponent = (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 text-lg font-medium mb-2">
        Aucun élément trouvé
      </div>
      <div className="text-gray-500 text-sm">
        Essayez d'ajuster vos filtres de recherche
      </div>
    </div>
  );

  if (items.length === 0 && !isLoading) {
    return emptyComponent || defaultEmptyComponent;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('grid gap-4', gridColsClass)}>
        {items.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index;
          return (
            <div key={key} className="snap-start">
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>

      {/* Sentinel element for intersection observer */}
      {hasMore && (
        <div ref={sentinelRef} className="w-full h-10">
          {isLoading && (loadingComponent || defaultLoadingComponent)}
        </div>
      )}

    </div>
  );
}
