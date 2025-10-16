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
            rounded-2xl bg-white flex flex-col items-center justify-between p-4 sm:p-6
            shadow-sm hover:shadow-md transition-all duration-300
            hover:bg-gradient-to-b hover:from-white hover:to-gray-50/50
            group cursor-pointer relative overflow-hidden
            min-h-[160px]
            ${className}
        `}>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-vapo-purple-primary/0 via-vapo-purple-primary to-vapo-purple-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {image ? (
                    <div className="w-full h-full rounded-xl bg-white shadow-sm p-3 flex items-center justify-center">
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" 
                        />
                    </div>
                ) : (
                    <div className="w-full h-full rounded-xl bg-white shadow-sm p-3 flex items-center justify-center">
                        <StoreIcon className="text-vapo-purple-primary w-10 h-10 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                )}
                
                <div className="absolute -inset-0.5 bg-gradient-to-br from-vapo-purple-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-sm" />
            </div>

            <div className="text-center mt-4 space-y-2 relative">
                <h3 className="text-gray-800 font-medium px-2 text-sm sm:text-base leading-tight">
                    {name}
                </h3>
                <div className="h-6">
                    <span className="text-xs text-vapo-purple-primary font-medium 
                        absolute inset-x-0 transform translate-y-1 opacity-0 
                        group-hover:translate-y-0 group-hover:opacity-100 
                        transition-all duration-300 flex items-center justify-center gap-1"
                    >
                        Voir les produits
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}