import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * Callback function to load more items
   */
  onLoadMore: () => void;
  /**
   * Whether there are more items to load
   */
  hasMore: boolean;
  /**
   * Whether currently loading
   */
  isLoading: boolean;
  /**
   * Root margin for intersection observer
   * Controls how far from the viewport edge to trigger loading
   * Default: '0px'
   * Example: '200px' will trigger 200px before element enters viewport
   */
  rootMargin?: string;
}

/**
 * Custom hook for infinite scrolling
 * @param options - Configuration options
 * @returns Ref to attach to the sentinel element
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '0px',
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin,
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel);
      }
    };
  }, [handleObserver, rootMargin]);

  return sentinelRef;
}
