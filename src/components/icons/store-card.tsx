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
        <div className={`
            rounded-2xl bg-white flex flex-col items-center justify-between  pb-6
            shadow-sm cursor-pointer  ${className}
        `}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {image ? (
                    <div className="w-full h-full rounded-xl bg-white  p-3 flex items-center justify-center">
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                ) : (
                    <div className="w-full h-full rounded-xl bg-white p-3 flex items-center justify-center">
                        <StoreIcon className="text-vapo-purple-primary w-10 h-10" />
                    </div>
                )}
            </div>
            <div className="text-center mt-4 space-y-2">
                <h3 className="text-gray-800 font-semibold h-auto uppercase px-2 text-sm leading-tight line-clamp-2 text-ellipsis">
                    {name}
                </h3>
            </div>
        </div>
    );
}