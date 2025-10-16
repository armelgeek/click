import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200/60", className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 flex flex-col items-center justify-between min-h-[160px]">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl" />
      <div className="w-full space-y-2 mt-4">
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    </div>
  );
}