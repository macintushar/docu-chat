import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none ring-zinc-950/10 dark:ring-zinc-950/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-[color,box-shadow] dark:border-zinc-800 dark:ring-zinc-300/10 dark:dark:ring-zinc-300/20",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 shadow-sm [a&]:hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:[a&]:hover:bg-zinc-50/90",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 [a&]:hover:bg-zinc-100/90 dark:bg-zinc-800 dark:text-zinc-50 dark:[a&]:hover:bg-zinc-800/90",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 shadow-sm [a&]:hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:[a&]:hover:bg-red-900/90",
        outline:
          "text-zinc-950 [a&]:hover:bg-zinc-100 [a&]:hover:text-zinc-900 dark:text-zinc-50 dark:[a&]:hover:bg-zinc-800 dark:[a&]:hover:text-zinc-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
