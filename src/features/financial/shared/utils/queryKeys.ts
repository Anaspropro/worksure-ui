export const financialQueryKeys = {
  all: ["finance"] as const,
  client: () => [...financialQueryKeys.all, "client"] as const,
  clientBalance: () => [...financialQueryKeys.client(), "balance"] as const,
  clientEscrow: () => [...financialQueryKeys.client(), "escrow"] as const,
  artisan: () => [...financialQueryKeys.all, "artisan"] as const,
  artisanEarnings: () => [...financialQueryKeys.artisan(), "earnings"] as const,
  artisanPayouts: () => [...financialQueryKeys.artisan(), "payouts"] as const,
  transactions: () => [...financialQueryKeys.all, "transactions"] as const,
  admin: () => [...financialQueryKeys.all, "admin"] as const,
  adminPayouts: () => [...financialQueryKeys.admin(), "payouts"] as const,
  adminReconciliation: () => [...financialQueryKeys.admin(), "reconciliation"] as const,
};
