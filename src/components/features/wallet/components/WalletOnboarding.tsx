import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowDownToLine } from "lucide-react";
import Link from "next/link";

interface WalletOnboardingProps {
  isClient: boolean;
  onDeposit: () => void;
}

export function WalletOnboarding({ isClient, onDeposit }: WalletOnboardingProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-5">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Welcome to your wallet!</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isClient
                ? "Your wallet is where you'll fund escrow contracts. Add funds first, then when you accept and contract an artisan, the agreed amount is locked in secure escrow until you approve the work."
                : "Your wallet receives payments when clients release escrow after you complete a job. You can withdraw earnings to your bank account at any time."}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {isClient ? (
                <>
                  <Button size="sm" onClick={onDeposit}>
                    <ArrowDownToLine className="size-3.5 mr-2" />
                    Add funds to get started
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/jobs">Browse or post jobs</Link>
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/jobs">Find work to start earning</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
