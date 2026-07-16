import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVerificationStatus, useSubmitMarketplaceVerification, useInitiateFinancialVerification } from '../api/queries';
import { Badge } from '@/components/ui/badge';

export const ArtisanVerificationDashboard = () => {
  const { data: status, isLoading } = useVerificationStatus();
  const submitMarketplace = useSubmitMarketplaceVerification();
  const initiateFinancial = useInitiateFinancialVerification();

  if (isLoading) return <div>Loading verification status...</div>;

  const handleFinancial = () => {
    initiateFinancial.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Identity Verification</h2>
        <p className="text-muted-foreground">
          Complete both marketplace and financial verification to be eligible for payouts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Marketplace Verification</span>
              <Badge variant={status?.marketplaceStatus === 'APPROVED' ? 'default' : 'secondary'}>
                {status?.marketplaceStatus || 'UNVERIFIED'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our team reviews your profile to ensure trust and quality on the WorkSure platform.
            </p>
            {status?.marketplaceStatus === 'UNVERIFIED' && (
              <Button onClick={() => submitMarketplace.mutate()} disabled={submitMarketplace.isPending}>
                Submit Profile for Review
              </Button>
            )}
            {status?.marketplaceStatus === 'REJECTED' && (
              <div className="text-destructive mb-2 text-sm">
                Reason: {status.marketplaceRejectedReason}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Financial Verification</span>
              <Badge variant={status?.financialStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                {status?.financialStatus || 'UNVERIFIED'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Secure identity verification required by financial regulations to receive payouts.
            </p>
            {status?.financialStatus !== 'VERIFIED' && (
              <Button onClick={handleFinancial} disabled={initiateFinancial.isPending}>
                Verify Identity with Paystack
              </Button>
            )}
            {status?.financialStatus === 'FAILED' && (
              <div className="text-destructive mb-2 text-sm">
                Reason: {status.financialFailureReason}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={status?.isPayoutEligible ? 'border-primary/50 bg-primary/5' : ''}>
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Payout Eligibility</h3>
            <p className="text-sm text-muted-foreground">
              {status?.isPayoutEligible 
                ? 'You are fully verified and eligible to receive payouts.' 
                : 'Complete both verifications above to unlock payouts.'}
            </p>
          </div>
          <Badge variant={status?.isPayoutEligible ? 'default' : 'outline'} className="text-sm">
            {status?.isPayoutEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
