import { Skeleton, StoreCardSkeleton } from './skeleton';

export function HomePageSkeleton() {
    return (
        <div className="min-h-screen text-white px-4 py-4 flex flex-col gap-6 font-inter">
            <Skeleton className="h-12 rounded-lg" />

            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-64 h-6" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <StoreCardSkeleton key={i} />
                ))}
            </div>

            <div className="flex items-center gap-2 mb-2 mt-4">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-32 h-6" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <StoreCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}