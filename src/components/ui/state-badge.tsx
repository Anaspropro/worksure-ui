import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const stateBadgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all focus-visible:ring-[3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      state: {
        DRAFT: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400",
        PENDING_PAYMENT: "bg-warning-50 text-warning-600 border-warning-200 [a]:hover:bg-warning-100",
        FUNDED: "bg-primary-50 text-primary-600 border-primary-200 [a]:hover:bg-primary-100",
        IN_PROGRESS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        CLIENT_CONFIRMED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
        READY_FOR_PAYOUT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        PAID_OUT: "bg-success-50 text-success-600 border-success-200 [a]:hover:bg-success-100",
        DISPUTED: "bg-danger-50 text-danger-600 border-danger-200 [a]:hover:bg-danger-100",
        CANCELLED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400",
        REFUNDED: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      },
    },
    defaultVariants: {
      state: "DRAFT",
    },
  }
)

interface StateBadgeProps extends React.ComponentProps<"span"> {
  state?: "DRAFT" | "PENDING_PAYMENT" | "FUNDED" | "IN_PROGRESS" | "CLIENT_CONFIRMED" | "READY_FOR_PAYOUT" | "PAID_OUT" | "DISPUTED" | "CANCELLED" | "REFUNDED"
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
