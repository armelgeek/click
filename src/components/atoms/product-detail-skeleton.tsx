import { Skeleton, ProductCardSkeleton } from './skeleton';

export function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="w-32 h-6" />
                </div>
                <Skeleton className="w-24 h-4" />
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
                <Skeleton className="aspect-square rounded-xl max-h-[400px]" />
                <div className="space-y-4">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-9 w-1/4" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-32 h-10 rounded-full" />
                        <Skeleton className="flex-1 h-12 rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-20 h-4" />
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