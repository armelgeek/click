import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/shared/lib/utils"


interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  icon?: React.ReactNode
  link?: React.ReactNode
}

function Label({
  className,
  icon,
  link,
  children,
  ...props
}: LabelProps) {
  const hasLink = !!link;
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        hasLink
          ? "grid grid-cols-[auto_1fr_auto] items-center gap-2 text-gray-500 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          : "flex items-center gap-2 text-gray-500 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1 flex items-center">{icon}</span>}
      <span>{children}</span>
      {link && <span className="justify-self-end">{link}</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }
