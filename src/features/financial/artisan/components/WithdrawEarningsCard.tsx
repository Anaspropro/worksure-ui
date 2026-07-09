import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpFromLine, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRequestPayout, useBanks } from "../hooks/useArtisanEarnings";

interface WithdrawEarningsCardProps {
  user: {
    payoutBankCode?: string | null;
    payoutAccountNumber?: string | null;
  };
}

export function WithdrawEarningsCard({ user }: WithdrawEarningsCardProps) {
  const payoutRequestMutation = useRequestPayout();
  const [amountInput, setAmountInput] = useState("");
  const [bankCode, setBankCode] = useState(user.payoutBankCode || "");
  const [accountNumber, setAccountNumber] = useState(user.payoutAccountNumber || "");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const banksQuery = useBanks({ enabled: isFormOpen });
  const banksList = banksQuery.data ?? [];
  const amount = Number(amountInput || 0);

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
          setIsFormOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit payout request.", { id: toastId });
        },
      }
    );
  };

  return (
    <Card className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:border-primary/20">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Zap className="size-24" />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          Request Payout
        </CardTitle>
        <CardDescription>Withdraw your cleared earnings to your bank account.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFormOpen ? (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="h-14 w-full sm:w-auto shadow-md"
          >
            <ArrowUpFromLine className="size-5 mr-2" />
            Request Payout
          </Button>
        ) : (
          <div className="rounded-xl border border-border/50 bg-background/40 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-semibold text-foreground border-b border-border/30 pb-3">
              Withdraw to Bank Account
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Bank</label>
                <Select value={bankCode} onValueChange={setBankCode} disabled={banksQuery.isLoading}>
                  <SelectTrigger className="w-full h-11 bg-background/50 border-border/50 focus:ring-primary/20 transition-colors">
                    <SelectValue placeholder={banksQuery.isLoading ? "Loading banks..." : "Select your bank"} />
                  </SelectTrigger>
                  <SelectContent>
                    {banksList.filter((b: any) => b && b.code).map((bank: any) => (
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
                disabled={amount <= 0 || payoutRequestMutation.status === "pending"}
                onClick={handleWithdrawFunds}
                className="flex-1 shadow-sm"
              >
                {payoutRequestMutation.status === "pending" ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsFormOpen(false);
                  setAmountInput("");
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
