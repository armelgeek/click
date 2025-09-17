interface ProductCardProps {
    image: string;
    title: string;
    subtitle?: string;
    className?: string;
}

export default function ProductCard({ image, title, subtitle, className = '' }: ProductCardProps) {
    return (
        <div className={`rounded-xl bg-gray-100 flex flex-col items-center flex-1 w-full ${className}`}>
            <div className="w-full flex items-center justify-center rounded-xl overflow-hidden bg-white">
                <img src={image} alt={title} className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-end w-full">
                <span className="text-black text-base font-light mt-2">{title}</span>
                {subtitle && <span className="text-black font-extrabold text-lg mt-1">{subtitle}</span>}
            </div>
        </div>
    );
}
