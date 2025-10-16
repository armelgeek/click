import { Skeleton, ProductCardSkeleton } from './skeleton';

export function ShopProductsPageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 w-full mb-4">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <div className="rounded-xl border border-vapo-purple-primary/10 shadow-sm mt-2 p-4 mx-3">
                    <div className="flex items-center justify-between mt-4 py-4">
                        <Skeleton className="w-32 h-6" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 my-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}