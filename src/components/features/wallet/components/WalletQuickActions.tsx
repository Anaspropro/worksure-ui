import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, ArrowUpFromLine, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useWalletDepositInit, useWalletPayoutRequest, useBanks } from "@/hooks/useWallet";
import { UserRole } from "@/types";

interface WalletQuickActionsProps {
  user: {
    payoutBankCode?: string | null;
    payoutAccountNumber?: string | null;
    role?: UserRole | string;
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

  const role: UserRole = (user.role as UserRole) || "CLIENT";

  return (
    <Card className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:border-primary/20">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Zap className="size-24" />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          Quick Actions
        </CardTitle>
        {role === "CLIENT" && <CardDescription>Add funds to your wallet </CardDescription>}
        {role === "ARTISAN" && <CardDescription> Reqquest payout to your bank account.</CardDescription>}
      </CardHeader>
      <CardContent className="">
        {/* Action buttons */}
        <div className="">
          {role === "CLIENT" && <Button
            variant={activeAction === "deposit" ? "default" : "outline"}
            onClick={() => {
              setActiveAction(activeAction === "deposit" ? null : "deposit");
              setAmountInput("");
            }}
            className={`h-14 transition-all ${activeAction === "deposit" ? "shadow-md" : "hover:bg-background/60 hover:border-primary/30"}`}
          >
            <ArrowDownToLine className={`size-5 mr-2 ${activeAction === "deposit" ? "" : "text-emerald-500"}`} />
            Add Funds
          </Button>
          }
          {role === "ARTISAN" && <Button
            variant={activeAction === "withdraw" ? "default" : "outline"}
            onClick={() => {
              setActiveAction(activeAction === "withdraw" ? null : "withdraw");
              setAmountInput("");
              setBankCode(user.payoutBankCode || "");
              setAccountNumber(user.payoutAccountNumber || "");
            }}
            className={`h-14 transition-all ${activeAction === "withdraw" ? "shadow-md" : "hover:bg-background/60 hover:border-primary/30"}`}
          >
            <ArrowUpFromLine className={`size-5 mr-2 ${activeAction === "withdraw" ? "" : "text-rose-500"}`} />
            Request Payout
          </Button>}
        </div>

        {/* Action form */}
        
          {activeAction && (
            <div
              className="rounded-xl border border-border/50 bg-background/40 p-5 space-y-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-foreground border-b border-border/30 pb-3">
                {activeAction === "deposit" ? "Add Funds via Paystack" : "Withdraw to Bank Account"}
              </p>
              
              {activeAction === "withdraw" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Bank</label>
                    <Select value={bankCode} onValueChange={setBankCode} disabled={banksQuery.isLoading}>
                      <SelectTrigger className="w-full h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-colors">
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
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Number</label>
                    <Input
                      type="text"
                      placeholder="e.g. 0123456789"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="bg-background/50 border-border/50 focus-visible:ring-primary/20 h-11 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    min={1}
                    className="pl-8 bg-background/50 border-border/50 focus-visible:ring-primary/20 h-11 text-lg font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  disabled={
                    amount <= 0 ||
                    (activeAction === "deposit"
                      ? depositInitMutation.status === "pending"
                      : payoutRequestMutation.status === "pending")
                  }
                  onClick={activeAction === "deposit" ? handleAddFunds : handleWithdrawFunds}
                  className="flex-1 shadow-sm"
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
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
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
