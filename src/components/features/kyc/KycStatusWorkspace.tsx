"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/features/auth";
import { useKyc } from "@/features/kyc/api/useKyc";

export default function KycStatusWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const kycQuery = useKyc(user?.role === "ARTISAN");

  if (!user) {
    return null;
  }

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">KYC and Verification Status</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Track the current verification signal on your artisan account and see what is still missing.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Current status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant={user.artisanVerified ? "success" : "warning"}>
              {user.artisanVerified ? "Verified artisan" : "Pending admin review"}
            </Badge>
            <p className="text-sm leading-7 text-muted-foreground">
              {user.artisanVerified
                ? "Your profile is approved and ready for proposal, contract, and payout workflows."
                : "Complete your artisan details and wait for admin review before treating verification as complete."}
            </p>
            <Button asChild>
              <Link href="/kyc/submit">Update verification details</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Readiness checklist</CardTitle>
            <CardDescription>These checks mirror the actual backend-backed artisan profile data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Profile exists: {kycQuery.data ? "Yes" : "No"}</p>
            <p>Bio added: {kycQuery.data?.bio ? "Yes" : "No"}</p>
            <p>Skills listed: {kycQuery.data?.skills ? "Yes" : "No"}</p>
            <p>Experience added: {kycQuery.data?.experience ? "Yes" : "No"}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
