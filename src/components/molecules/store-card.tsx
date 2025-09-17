interface StoreCardProps {
    name: string;
    image?: string;
    className?: string;
}

function StoreIcon({ className = '' }: { className?: string }) {
    return (
        <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="16" y="28" width="32" height="18" rx="2" />
            <path d="M12 28h40M20 28V18h24v10" />
        </svg>
    );
}

export default function StoreCard({ name, image, className = '' }: StoreCardProps) {
    return (
        <div className={`rounded-xl bg-white flex flex-col items-center justify-center  py-6 shadow-sm border border-gray-100  ${className}`}>
            {image ? (
                <img src={image} alt={name} className="w-8 h-8 object-contain" />
            ) : (
                <StoreIcon className="text-vapo-violet mb-4" />
            )}
            <span className="text-black px-3 text-sm font-medium text-center mt-2">{name}</span>
        </div>
    );
}