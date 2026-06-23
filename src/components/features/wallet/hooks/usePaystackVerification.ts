import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useWalletDepositVerify, useWalletBalance, useWalletSummary, useWalletTransactions } from "@/hooks/useWallet";

export function usePaystackVerification(
  balanceQuery: ReturnType<typeof useWalletBalance>,
  summaryQuery: ReturnType<typeof useWalletSummary>,
  transactionsQuery: ReturnType<typeof useWalletTransactions>
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const depositVerifyMutation = useWalletDepositVerify();
  const paystackProcessedRef = useRef(false);

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const status = searchParams.get("status");

    if (reference && !paystackProcessedRef.current && (!status || status === "success")) {
      paystackProcessedRef.current = true;
      
      depositVerifyMutation.mutate(
        { reference },
        {
          onSuccess: () => {
            toast.success("Payment verified and wallet updated.");
            router.replace(pathname, { scroll: false }); // Clean up the URL
            void balanceQuery.refetch();
            void summaryQuery.refetch();
            void transactionsQuery.refetch();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Payment verification failed.");
          },
        }
      );
    }
  }, [searchParams, pathname, router, depositVerifyMutation, balanceQuery, summaryQuery, transactionsQuery]);
}
