import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useFundAccount } from "../hooks/useClientFinances";

export function FundAccountCard() {
  const depositInitMutation = useFundAccount();
  const [amountInput, setAmountInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const amount = Number(amountInput || 0);

  const handleAddFunds = () => {
    if (amount <= 0) return;
    
    const toastId = toast.loading("Initializing payment gateway...");
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

  return (
    <Card className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:border-primary/20">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Zap className="size-24" />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          Fund Account
        </CardTitle>
        <CardDescription>Add money securely via Paystack to fund escrow and pay for contracts.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFormOpen ? (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="h-14 w-full sm:w-auto shadow-md"
          >
            <ArrowDownToLine className="size-5 mr-2" />
            Add Funds
          </Button>
        ) : (
          <div className="rounded-xl border border-border/50 bg-background/40 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-semibold text-foreground border-b border-border/30 pb-3">
              Add Funds via Paystack
            </p>

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
                disabled={amount <= 0 || depositInitMutation.status === "pending"}
                onClick={handleAddFunds}
                className="flex-1 shadow-sm"
              >
                {depositInitMutation.status === "pending" ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Proceed to Payment"
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
