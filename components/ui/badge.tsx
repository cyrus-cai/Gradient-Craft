import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 gap-1 text-xs font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow hover:from-purple-600 hover:to-pink-700",
        secondary:
          "bg-gray-200 text-gray-800 hover:from-gray-600 hover:to-gray-700",
        outline:
          "bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-900/30",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow hover:from-red-700 hover:to-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }