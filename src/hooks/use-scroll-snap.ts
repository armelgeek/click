import { useEffect, useRef, useState } from 'react';

interface UseScrollSnapOptions {
  /**
   * Enable smooth scrolling
   */
  smooth?: boolean;
  /**
   * Axis to scroll on
   */
  axis?: 'x' | 'y';
  /**
   * Callback when scroll position changes
   */
  onScroll?: (position: number) => void;
}

/**
 * Custom hook for horizontal/vertical scroll with snap behavior
 * @param options - Configuration options
 * @returns Ref and scroll controls
 */
export function useScrollSnap({
  smooth = true,
  axis = 'x',
  onScroll,
}: UseScrollSnapOptions = {}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    if (axis === 'x') {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollLeft < element.scrollWidth - element.clientWidth - 1
      );
    } else {
      setCanScrollLeft(element.scrollTop > 0);
      setCanScrollRight(
        element.scrollTop < element.scrollHeight - element.clientHeight - 1
      );
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      checkScrollability();
      if (onScroll) {
        onScroll(axis === 'x' ? element.scrollLeft : element.scrollTop);
      }
    };

    element.addEventListener('scroll', handleScroll);
    checkScrollability();

    // Check on resize
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [axis, onScroll]);

  const scrollTo = (position: number) => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    if (axis === 'x') {
      element.scrollTo({
        left: position,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } else {
      element.scrollTo({
        top: position,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const scrollBy = (amount: number) => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    if (axis === 'x') {
      element.scrollBy({
        left: amount,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } else {
      element.scrollBy({
        top: amount,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const scrollToStart = () => scrollTo(0);
  
  const scrollToEnd = () => {
    if (!scrollRef.current) return;
    const element = scrollRef.current;
    scrollTo(axis === 'x' ? element.scrollWidth : element.scrollHeight);
  };

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollTo,
    scrollBy,
    scrollToStart,
    scrollToEnd,
  };
}
