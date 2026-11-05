import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useVerificationStatus,
  useSubmitMarketplaceVerification,
  useResolveBankAccount,
  useSupportedBanks,
} from '../api/queries';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';

export const ArtisanVerificationDashboard = () => {
  const { data: status, isLoading } = useVerificationStatus();
  const { data: banks, isLoading: isLoadingBanks } = useSupportedBanks();
  const submitMarketplace = useSubmitMarketplaceVerification();
  const resolveBank = useResolveBankAccount();

  const [bankCode, setBankCode] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading verification status...</span>
      </div>
    );
  }

  const handleResolveBank = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankCode) {
      toast.error('Please select your bank');
      return;
    }

    if (!accountNumber || accountNumber.trim().length !== 10 || !/^\d+$/.test(accountNumber.trim())) {
      toast.error('Please enter a valid 10-digit account number');
      return;
    }

    resolveBank.mutate(
      {
        bankCode: bankCode.trim(),
        accountNumber: accountNumber.trim(),
      },
      {
        onSuccess: (data: any) => {
          toast.success(
            `Bank account verified: ${data.accountName || 'Success'}`,
          );
        },
        onError: (err: any) => {
          toast.error(
            err.message || 'Bank resolution failed. Please verify your details.',
          );
        },
      },
    );
  };

  const selectedBankName =
    banks?.find((b) => b.code === (status?.payoutBankCode || bankCode))?.name ||
    status?.payoutBankCode ||
    'Bank';

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Identity & Marketplace Verification</h2>
        <p className="text-muted-foreground mt-1">
          Complete your marketplace profile review and Paystack bank account resolution to unlock bidding and payouts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Marketplace Verification Card */}
        <Card className="border border-border shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Marketplace Verification
              </span>
              <Badge
                variant={
                  status?.marketplaceStatus === 'APPROVED'
                    ? 'default'
                    : status?.marketplaceStatus === 'PENDING_REVIEW'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {status?.marketplaceStatus === 'APPROVED'
                  ? 'APPROVED'
                  : status?.marketplaceStatus === 'PENDING_REVIEW'
                  ? 'IN REVIEW'
                  : status?.marketplaceStatus || 'NOT SUBMITTED'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground">
              Our compliance and operations team inspects your business profile, skills, and background to ensure platform trust and safety.
            </p>

            {status?.marketplaceStatus === 'APPROVED' && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Profile Verified</h4>
                  <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400">
                    Your artisan profile has been approved. You have full access to submit proposals and accept contracts.
                  </p>
                </div>
              </div>
            )}

            {status?.marketplaceStatus === 'PENDING_REVIEW' && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300 flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Under Review</h4>
                  <p className="text-xs mt-1 text-amber-700 dark:text-amber-400">
                    Your profile was submitted and is currently being audited by an administrator. You will be notified once reviewed.
                  </p>
                </div>
              </div>
            )}

            {status?.marketplaceStatus === 'REJECTED' && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Verification Rejected</h4>
                    <p className="text-xs mt-1">
                      Reason: {status.marketplaceRejectedReason || 'Documentation or profile details did not satisfy requirements.'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => submitMarketplace.mutate()}
                  disabled={submitMarketplace.isPending}
                >
                  {submitMarketplace.isPending ? 'Re-submitting...' : 'Re-submit Profile for Review'}
                </Button>
              </div>
            )}

            {status?.marketplaceStatus === 'NOT_SUBMITTED' && (
              <Button
                className="w-full mt-4"
                onClick={() => submitMarketplace.mutate()}
                disabled={submitMarketplace.isPending}
              >
                {submitMarketplace.isPending ? 'Submitting...' : 'Submit Profile for Review'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Financial Verification Card */}
        <Card className="border border-border shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Financial & Bank Resolution
              </span>
              <Badge
                variant={
                  status?.financialStatus === 'VERIFIED'
                    ? 'default'
                    : 'secondary'
                }
              >
                {status?.financialStatus === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <p className="text-sm text-muted-foreground">
              WorkSure verifies your bank account name against your registered profile using Paystack to guarantee secure and compliant escrow payouts.
            </p>

            {status?.financialStatus === 'VERIFIED' ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-sm">Bank Account Verified</span>
                </div>
                <div className="text-xs space-y-1 text-emerald-700 dark:text-emerald-400 pt-1">
                  <div>
                    <span className="font-medium">Account Name: </span>
                    {status.payoutAccountName || 'Verified Payout Account'}
                  </div>
                  <div>
                    <span className="font-medium">Bank: </span>
                    {selectedBankName}
                  </div>
                  <div>
                    <span className="font-medium">Account Number: </span>
                    {status.payoutAccountNumber
                      ? `******${status.payoutAccountNumber.slice(-4)}`
                      : 'Verified'}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResolveBank} className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="bank-select" className="text-xs">
                    Select Bank
                  </Label>
                  <select
                    id="bank-select"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isLoadingBanks || resolveBank.isPending}
                  >
                    <option value="">-- Choose your Nigerian bank --</option>
                    {banks?.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="account-number" className="text-xs">
                    10-Digit NUBAN Account Number
                  </Label>
                  <Input
                    id="account-number"
                    type="text"
                    maxLength={10}
                    placeholder="e.g. 0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    disabled={resolveBank.isPending}
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={resolveBank.isPending}
                >
                  {resolveBank.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resolving with Paystack...
                    </>
                  ) : (
                    'Verify Bank Account'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payout Eligibility Status Banner */}
      <Card
        className={
          status?.isPayoutEligible
            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm'
            : 'border-border bg-card shadow-sm'
        }
      >
        <CardContent className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {status?.isPayoutEligible ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
              Escrow Payout Eligibility
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {status?.isPayoutEligible
                ? 'Your account is fully verified. You are eligible to receive milestone and escrow payouts.'
                : 'Both Marketplace Review and Paystack Bank Account Resolution must be approved to unlock payout disbursements.'}
            </p>
          </div>
          <Badge
            variant={status?.isPayoutEligible ? 'default' : 'outline'}
            className="text-sm px-3 py-1 shrink-0"
          >
            {status?.isPayoutEligible ? 'PAYOUT ELIGIBLE' : 'ACTION REQUIRED'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
