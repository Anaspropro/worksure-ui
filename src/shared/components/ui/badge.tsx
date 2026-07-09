import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-600 border-primary-200 [a]:hover:bg-primary-100",
        secondary:
          "bg-accent text-accent-foreground [a]:hover:bg-accent/85",
        destructive:
          "bg-danger-50 text-danger-600 border-danger-200 focus-visible:ring-danger/20 [a]:hover:bg-danger-100",
        success: "bg-success-50 text-success-600 border-success-200 [a]:hover:bg-success-100",
        warning: "bg-warning-50 text-warning-600 border-warning-200 [a]:hover:bg-warning-100",
        info: "bg-primary-50 text-primary-600 border-primary-200 [a]:hover:bg-primary-100",
        purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        outline:
          "border-border bg-background text-foreground [a]:hover:bg-accent [a]:hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-secondary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
