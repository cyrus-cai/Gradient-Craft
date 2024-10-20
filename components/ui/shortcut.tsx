import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const shortcutVariants = cva(
    "px-2 py-1 rounded-xl font-mono transform text-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900",
    {
        variants: {
            variant: {
                default: "text-amber-800 dark:text-amber-200 bg-amber-500/10 dark:bg-amber-500/20 focus:ring-amber-400 dark:focus:ring-amber-300",
                secondary: "text-blue-800 dark:text-blue-200 bg-blue-500/10 dark:bg-blue-500/20 focus:ring-blue-400 dark:focus:ring-blue-300",
                destructive: "text-red-800 dark:text-red-200 bg-red-500/10 dark:bg-red-500/20 focus:ring-red-400 dark:focus:ring-red-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface ShortcutProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shortcutVariants> { }

export function Shortcut({ className, variant, children, ...props }: ShortcutProps) {
    return (
        <div className={cn(shortcutVariants({ variant }), className)} {...props}>
            {children}
        </div>
    )
}