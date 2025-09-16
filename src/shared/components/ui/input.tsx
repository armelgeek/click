import * as React from "react"

import { cn } from "@/shared/lib/utils"


interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'search';
  rightIcon?: React.ReactNode;
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  const base =
    "file:text-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
  const variants = {
    default:
      "bg-transparent border border-gray-300 placeholder:text-gray-400 text-gray-700 focus-visible:border-vapo-violet focus-visible:ring-vapo-violet/30",
    search:
      "bg-vapo-purple-primary/10 border-none placeholder:text-vapo-purple-primary/80 text-vapo-purple-primary/80 font-medium",
  };
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(base.replace('w-full', ''), 'w-full', variants[variant], props.rightIcon ? 'pr-10' : '', className)}
        {...props}
      />
      {props.rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-xl text-vapo-violet">
          {props.rightIcon}
        </span>
      )}
    </div>
  );
}

export { Input }
