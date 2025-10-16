interface ProductCardProps {
    image: string;
    title: string;
    subtitle?: string;
    className?: string;
}
export default function ProductCard({ image, title, subtitle, className = '' }: ProductCardProps) {
    return (
        <div className={`rounded-xl bg-gray-100 flex flex-col items-center flex-1 w-full min-h-[180px] max-h-[220px] ${className}`}>
            <div className="w-full flex items-center justify-center rounded-xl overflow-hidden bg-white min-h-[80px] max-h-[100px]">
                <img src={image} alt={title} className="object-cover max-h-[90px]" />
            </div>
            <div className="flex-1 flex flex-col justify-end w-full px-2">
                <span
                    className="text-black text-base font-light mt-2 truncate block max-w-full"
                    title={title}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {title}
                </span>
                {subtitle && (
                    <span className="text-black font-extrabold text-lg mt-1 truncate block max-w-full"
                        title={subtitle}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}
