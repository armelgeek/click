import { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'caption';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Typography({ 
  children, 
  variant = 'body', 
  className = '',
  as: Component = 'p'
}: TypographyProps) {
  let base = '';
  switch (variant) {
    case 'h1':
      base = 'text-4xl font-bold leading-tight';
      break;
    case 'h2':
      base = 'text-3xl font-semibold leading-tight';
      break;
    case 'h3':
      base = 'text-2xl font-medium leading-snug';
      break;
    case 'title':
      base = 'text-2xl font-bold';
      break;
    case 'subtitle':
      base = 'text-lg font-semibold';
      break;
    case 'caption':
      base = 'text-xs text-gray-400';
      break;
    default:
      base = 'text-base leading-relaxed';
  }
  
  return (
    <Component className={`${base} ${className}`}>
      {children}
    </Component>
  );
}
