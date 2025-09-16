import * as React from 'react';

interface CategoryIconProps {
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export default function CategoryIcon({ icon, label, className = '' }: CategoryIconProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
        {icon ? icon : (
          <img src='/icons/bottle.svg'/>
        )}
      </div>
      {label && <span className="text-center text-gray-700 text-sm font-medium mt-2">{label}</span>}
    </div>
  );
}
