import { Skeleton, ProductCardSkeleton } from './skeleton';

export function CartPageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col gap-6 p-4">
            <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-32 h-6" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 flex gap-4">
                        <Skeleton className="w-20 h-20 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="w-3/4 h-5" />
                            <Skeleton className="w-1/4 h-6" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-24 h-8 rounded-full" />
                                <Skeleton className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-24 h-5" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="w-24 h-5" />
                    <Skeleton className="w-20 h-5" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-28 h-6" />
                </div>
                <Skeleton className="w-full h-12 rounded-lg" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}