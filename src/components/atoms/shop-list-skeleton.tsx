import { Skeleton, StoreCardSkeleton } from './skeleton';

export function ShopListPageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col gap-4 p-4">
            <Skeleton className="h-10 rounded-lg" />
            
            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-48 h-6" />
            </div>

            <div className="flex justify-between mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <Skeleton className="w-16 h-3" />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-56 h-6" />
            </div>

            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="min-w-[200px]">
                        <StoreCardSkeleton />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-32 h-6" />
            </div>

            <div className="flex gap-4 mb-2">
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="w-40 h-10 rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <StoreCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}