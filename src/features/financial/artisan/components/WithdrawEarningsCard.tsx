import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpFromLine, Loader2, Zap, Landmark, ArrowRight, WalletCards, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRequestPayout, useBanks } from "../hooks/useArtisanEarnings";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // Steps: 0 = Closed, 1 = Amount, 2 = Bank Details, 3 = Success
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  
  const banksQuery = useBanks({ enabled: step >= 1 });
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
          setStep(3); // Move to success step
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit payout request.", { id: toastId });
        },
      }
    );
  };

  const resetForm = () => {
    setStep(0);
    setAmountInput("");
    // Keep bank details saved
  };

  return (
    <Card className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:border-primary/20">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <Landmark className="size-32" />
      </div>
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowUpFromLine className="size-4 text-primary" />
          </div>
          Withdraw Funds
        </CardTitle>
        <CardDescription>Transfer cleared earnings directly to your local bank account.</CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => setStep(1)}
                className="h-14 w-full shadow-md bg-primary hover:bg-primary/90 transition-all group"
              >
                <WalletCards className="size-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Withdrawal
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                  <span>Amount to Withdraw</span>
                  <span className="text-primary font-bold">Step 1 of 2</span>
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-muted-foreground group-focus-within:text-primary transition-colors">₦</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    min={1}
                    autoFocus
                    className="pl-10 bg-background border-border/50 focus-visible:ring-primary/30 h-16 text-3xl font-medium transition-all shadow-inner rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(0)}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  disabled={amount <= 0}
                  onClick={() => setStep(2)}
                  className="flex-[2] h-12 shadow-md group"
                >
                  Continue
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Destination Bank
                </label>
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Step 2 of 2</span>
              </div>
              
              <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/40">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase">Bank Name</label>
                  <Select value={bankCode} onValueChange={setBankCode} disabled={banksQuery.isLoading}>
                    <SelectTrigger className="w-full h-12 bg-background border-border focus:ring-primary/20 transition-colors">
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
                  <label className="text-[11px] font-medium text-muted-foreground uppercase">Account Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. 0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    maxLength={10}
                    className="bg-background border-border focus-visible:ring-primary/20 h-12 transition-colors font-medium tracking-wide"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-12 px-4"
                >
                  Back
                </Button>
                <Button
                  disabled={accountNumber.length < 10 || !bankCode || payoutRequestMutation.status === "pending"}
                  onClick={handleWithdrawFunds}
                  className="flex-1 h-12 shadow-md relative overflow-hidden"
                >
                  {payoutRequestMutation.status === "pending" ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="size-4 animate-spin" /> Processing...
                    </motion.div>
                  ) : (
                    <span className="font-semibold">Withdraw ₦{amount.toLocaleString()}</span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="flex flex-col items-center text-center py-6 space-y-4"
            >
              <div className="size-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight">Request Submitted</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">
                  Your withdrawal of ₦{amount.toLocaleString()} is being processed and will arrive shortly.
                </p>
              </div>
              <Button onClick={resetForm} variant="outline" className="mt-4 h-11 px-8 rounded-full">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
