import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWalletDepositInit, useWalletPayoutRequest, useBanks } from "@/hooks/useWallet";

interface WalletQuickActionsProps {
  user: {
    payoutBankCode?: string | null;
    payoutAccountNumber?: string | null;
  };
}

export function WalletQuickActions({ user }: WalletQuickActionsProps) {
  const depositInitMutation = useWalletDepositInit();
  const payoutRequestMutation = useWalletPayoutRequest();
  
  const [amountInput, setAmountInput] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | null>(null);
  
  const banksQuery = useBanks({ enabled: activeAction === "withdraw" });
  const banksList = banksQuery.data ?? [];
  const amount = Number(amountInput || 0);

  const handleAddFunds = () => {
    const toastId = toast.loading("Initializing payment...");
    depositInitMutation.mutate(
      { amount, callbackUrl: window.location.href },
      {
        onSuccess: (data) => {
          toast.dismiss(toastId);
          if (data.authorizationUrl) {
            window.location.href = data.authorizationUrl;
          }
        },
        onError: (error) => {
          toast.error(error.message || "Unable to initialize deposit.", { id: toastId });
        },
      }
    );
  };

  const handleWithdrawFunds = () => {
    if (!bankCode || !accountNumber) {
      toast.error("Please enter your bank code and account number.");
      return;
    }
    const toastId = toast.loading("Submitting payout request...");
    payoutRequestMutation.mutate(
      { amount, bankCode, accountNumber },
      {
        onSuccess: () => {
          toast.success("Payout request submitted for approval.", { id: toastId });
          setAmountInput("");
          setBankCode("");
          setAccountNumber("");
          setActiveAction(null);
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit payout request.", { id: toastId });
        },
      }
    );
  };

  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>
          Add funds to your wallet or withdraw to your bank account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant={activeAction === "deposit" ? "default" : "outline"}
            onClick={() => {
              setActiveAction(activeAction === "deposit" ? null : "deposit");
              setAmountInput("");
            }}
            className="flex-1"
          >
            <ArrowDownToLine className="size-4 mr-2" />
            Add funds
          </Button>
          <Button
            variant={activeAction === "withdraw" ? "default" : "outline"}
            onClick={() => {
              setActiveAction(activeAction === "withdraw" ? null : "withdraw");
              setAmountInput("");
              setBankCode(user.payoutBankCode || "");
              setAccountNumber(user.payoutAccountNumber || "");
            }}
            className="flex-1"
          >
            <ArrowUpFromLine className="size-4 mr-2" />
            Request Payout
          </Button>
        </div>

        {/* Action form */}
        {activeAction && (
          <div className="rounded-lg border border-border bg-surface-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              {activeAction === "deposit" ? "Add funds to wallet" : "Request payout to bank account"}
            </p>
            
            {activeAction === "withdraw" && (
              <>
                <div className="flex items-center gap-2">
                  <Select value={bankCode} onValueChange={setBankCode} disabled={banksQuery.isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={banksQuery.isLoading ? "Loading banks..." : "Select your bank"} />
                    </SelectTrigger>
                    <SelectContent>
                      {banksList.filter(b => b && b.code).map((bank) => (
                        <SelectItem key={bank.code.toString()} value={bank.code.toString()}>
                          {bank.name || "Unknown Bank"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="text"
                  placeholder="Account Number (10 digits)"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </>
            )}

            <Input
              type="number"
              placeholder="Enter amount (₦)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              min={1}
            />

            <div className="flex gap-2">
              <Button
                disabled={
                  amount <= 0 ||
                  (activeAction === "deposit"
                    ? depositInitMutation.status === "pending"
                    : payoutRequestMutation.status === "pending")
                }
                onClick={activeAction === "deposit" ? handleAddFunds : handleWithdrawFunds}
                className="flex-1"
              >
                {(activeAction === "deposit"
                  ? depositInitMutation.status
                  : payoutRequestMutation.status) === "pending" ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Processing...</>
                ) : activeAction === "deposit" ? (
                  "Proceed to Payment"
                ) : (
                  "Submit Payout Request"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveAction(null);
                  setAmountInput("");
                  setBankCode("");
                  setAccountNumber("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
