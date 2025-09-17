import { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  className?: string;
}

export default function Typography({ children, variant = 'body', className = '' }: TypographyProps) {
  let base = '';
  switch (variant) {
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
      base = 'text-base';
  }
  return <span className={`${base} ${className}`}>{children}</span>;
}
