interface ProductCardProps {
    image: string;
    title: string;
    subtitle?: string;
    className?: string;
}
export default function ProductCard({ image, title, subtitle, className = '' }: ProductCardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col w-full ${className}`}>
            <div className="aspect-square w-full p-4 flex items-center justify-center bg-gray-50 rounded-t-lg">
                <img 
                    src={image} 
                    alt={title} 
                    className="object-contain w-full h-full max-h-[120px]"
                    onError={(e) => { e.currentTarget.src = '/icons/product.png'; }}
                />
            </div>
            <div className="p-4 flex flex-col">
                <h3
                    className="text-gray-800 text-sm font-medium line-clamp-2 min-h-[40px]"
                    title={title}
                >
                    {title}
                </h3>
                {subtitle && (
                    <div className="mt-2 flex items-center justify-between">
                        <span 
                            className="text-vapo-purple-primary font-bold text-lg"
                            title={subtitle}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
