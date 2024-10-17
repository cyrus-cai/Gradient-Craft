import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500/25 text-amber-900 hover:bg-amber-500/50 dark:bg-amber-700/25 dark:text-amber-100 dark:hover:bg-amber-700/50",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800",
        outline:
          "border border-amber-200 bg-transparent shadow-sm hover:bg-amber-100 hover:text-amber-900 dark:border-amber-700 dark:hover:bg-amber-900 dark:hover:text-amber-100",
        secondary:
          "bg-amber-200 text-amber-900 shadow-sm hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700",
        ghost:
          "hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-900 dark:hover:text-amber-100",
        link:
          "text-amber-600 underline-offset-4 hover:underline dark:text-amber-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }