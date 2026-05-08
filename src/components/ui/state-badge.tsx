import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const stateBadgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all focus-visible:ring-[3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      state: {
        DRAFT: "bg-muted text-muted-foreground border-border",
        PENDING_PAYMENT: "bg-warning/10 text-warning border-warning/20",
        FUNDED: "bg-primary/10 text-primary border-primary/20",
        IN_PROGRESS: "bg-info/10 text-info border-info/20",
        CLIENT_CONFIRMED: "bg-info/10 text-info border-info/20",
        READY_FOR_PAYOUT: "bg-warning/10 text-warning border-warning/20",
        PAID_OUT: "bg-success/10 text-success border-success/20",
        DISPUTED: "bg-danger/10 text-danger border-danger/20",
        CANCELLED: "bg-muted text-muted-foreground border-border",
        REFUNDED: "bg-success/10 text-success border-success/20",
        PAYMENT_FAILED: "bg-danger/10 text-danger border-danger/20",
        EXPIRED: "bg-muted text-muted-foreground border-border",
      },
    },
    defaultVariants: {
      state: "DRAFT",
    },
  }
)

interface StateBadgeProps extends React.ComponentProps<"span"> {
  state?: "DRAFT" | "PENDING_PAYMENT" | "FUNDED" | "IN_PROGRESS" | "CLIENT_CONFIRMED" | "READY_FOR_PAYOUT" | "PAID_OUT" | "DISPUTED" | "CANCELLED" | "REFUNDED" | "PAYMENT_FAILED" | "EXPIRED"
  asChild?: boolean
}

function StateBadge({
  className,
  state = "DRAFT",
  asChild = false,
  ...props
}: StateBadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-state={state}
      className={cn(stateBadgeVariants({ state }), className)}
      {...props}
    />
  )
}

export { StateBadge, stateBadgeVariants }
