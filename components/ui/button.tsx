import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-yellow-600/5 text-yellow-700 hover:bg-yellow-600/5 dark:bg-yellow-700/25 dark:text-yellow-600/5 dark:hover:bg-yellow-500/75",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800",
        outline:
          "border border-yellow-600/5 bg-transparent shadow-sm hover:bg-yellow-600/5 hover:text-yellow-900 dark:border-yellow-700 dark:hover:bg-yellow-900 dark:hover:text-yellow-600/5",
        secondary:
          "bg-yellow-600/5 text-yellow-900 shadow-sm hover:bg-yellow-600/50 dark:bg-yellow-800 dark:text-yellow-600/5 dark:hover:bg-yellow-700",
        ghost:
          "hover:bg-yellow-600/5 hover:text-yellow-900 dark:hover:bg-yellow-900 dark:hover:text-yellow-600/5",
        link:
          "text-yellow-600 underline-offset-4 hover:underline dark:text-yellow-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
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