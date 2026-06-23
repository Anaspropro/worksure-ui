import { useEffect, useRef } from "react";
import { useWalletBalance, useWalletSummary, useCreateWallet } from "@/hooks/useWallet";

export function useWalletInitialization(canLoadProtectedData: boolean) {
  const balanceQuery = useWalletBalance({ enabled: canLoadProtectedData });
  const summaryQuery = useWalletSummary({ enabled: canLoadProtectedData });
  const createWalletMutation = useCreateWallet();
  const walletAutoCreatedRef = useRef(false);

  useEffect(() => {
    if (!canLoadProtectedData || walletAutoCreatedRef.current) return;
    if (balanceQuery.isLoading) return;

    // If balance query failed (wallet doesn't exist), auto-create
    if (balanceQuery.isError || (balanceQuery.data && !balanceQuery.data.exists)) {
      walletAutoCreatedRef.current = true;
      createWalletMutation.mutate(undefined, {
        onSuccess: () => {
          void balanceQuery.refetch();
          void summaryQuery.refetch();
        },
      });
    } else if (balanceQuery.data?.exists) {
      walletAutoCreatedRef.current = true;
    }
  }, [
    canLoadProtectedData,
    balanceQuery.isLoading,
    balanceQuery.isError,
    balanceQuery.data,
    createWalletMutation,
    summaryQuery,
  ]);

  return {
    balanceQuery,
    summaryQuery,
    isInitializing: balanceQuery.isLoading || createWalletMutation.status === "pending",
  };
}
