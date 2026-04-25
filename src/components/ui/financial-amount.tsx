import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const financialAmountVariants = cva(
  "font-mono font-semibold",
  {
    variants: {
      type: {
        primary: "text-amount-primary",
        positive: "text-positive-balance",
        negative: "text-negative-fee",
        neutral: "text-neutral-amount",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
      },
    },
    defaultVariants: {
      type: "primary",
      size: "default",
    },
  }
)

interface FinancialAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string
  currency?: string
  type?: "primary" | "positive" | "negative" | "neutral"
  size?: "sm" | "default" | "lg" | "xl" | "2xl" | "3xl"
  showSign?: boolean
  asChild?: boolean
}

function FinancialAmount({
  className,
  amount,
  currency = "₦",
  type = "primary",
  size = "default",
  showSign = false,
  asChild = false,
  ...props
}: FinancialAmountProps) {
  const Comp = asChild ? Slot.Root : "span"
  
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount
  
  const sign = showSign && typeof amount === 'number' && amount > 0 ? '+' : ''
  
  return (
    <Comp
      data-slot="financial-amount"
      data-type={type}
      className={cn(financialAmountVariants({ type, size }), className)}
      {...props}
    >
      {currency}{sign}{formattedAmount}
    </Comp>
  )
}

export { FinancialAmount, financialAmountVariants }
