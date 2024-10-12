import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const shortcutVariants = cva(
    "px-2 py-1 rounded-sm font-mono transform text-xs transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "text-amber-800 bg-amber-500/10 focus:ring-amber-400",
                secondary: "text-blue-800 bg-blue-500/10 focus:ring-blue-400",
                destructive: "text-red-800 bg-red-500/10 focus:ring-red-400",
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