import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  notification?: boolean;
}

export default function IconButton({ children, notification, ...props }: IconButtonProps) {
  return (
    <button {...props} className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none">
      {children}
      {notification && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
