"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as React from "react"

import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-gradient-to-r focus:from-yellow-50 focus:to-yellow-600/5 data-[state=open]:bg-gradient-to-r data-[state=open]:from-yellow-600/5 data-[state=open]:to-yellow-600/5 transition-all duration-200 ease-in-out",
      "dark:focus:from-yellow-900/60 dark:focus:to-yellow-800/60 dark:data-[state=open]:from-yellow-800/60 dark:data-[state=open]:to-yellow-700/60 dark:text-yellow-100",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4 text-yellow-500 dark:text-yellow-300" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-yellow-600/5 bg-white/90 p-2 text-yellow-900 shadow-lg backdrop-blur-sm",
      "dark:border-yellow-700/50 dark:bg-yellow-950/95 dark:text-yellow-100",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-yellow-600/5 bg-gradient-to-b from-white to-yellow-50/80 p-3 text-yellow-900 shadow-2xl backdrop-blur-sm",
        "dark:border-yellow-700/50 dark:from-yellow-950/95 dark:to-yellow-900/95 dark:text-yellow-100",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:bg-gradient-to-r focus:from-yellow-600/5 focus:to-yellow-600/5 focus:text-yellow-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-yellow-600/70",
      "dark:focus:from-yellow-800/60 dark:focus:to-yellow-700/60 dark:focus:text-yellow-100 dark:hover:bg-yellow-800/40 dark:text-yellow-100",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xl py-2.5 pl-8 pr-4 text-sm outline-none transition-colors focus:bg-gradient-to-r focus:from-yellow-600/5 focus:to-yellow-600/5 focus:text-yellow-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-yellow-600/70",
      "dark:focus:from-yellow-800/60 dark:focus:to-yellow-700/60 dark:focus:text-yellow-100 dark:hover:bg-yellow-800/40 dark:text-yellow-100",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center rounded-xl border border-yellow-600/50 bg-white dark:border-yellow-500 dark:bg-yellow-900">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-3 w-3 text-yellow-500 dark:text-yellow-300" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-xl py-2.5 pl-8 pr-4 text-sm outline-none transition-colors focus:bg-gradient-to-r focus:from-yellow-600/5 focus:to-yellow-600/5 focus:text-yellow-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-yellow-600/70",
      "dark:focus:from-yellow-800/60 dark:focus:to-yellow-700/60 dark:focus:text-yellow-100 dark:hover:bg-yellow-800/40 dark:text-yellow-100",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center rounded-full border border-yellow-600/50 bg-white dark:border-yellow-500 dark:bg-yellow-900">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="h-3 w-3 fill-yellow-500 dark:fill-yellow-300" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-4 py-2.5 text-sm font-medium text-yellow-800/90 dark:text-yellow-300",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-2 h-px bg-yellow-600/60 dark:bg-yellow-600/40", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-yellow-600/70 dark:text-yellow-300/90", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}