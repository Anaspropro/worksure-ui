"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function VerificationWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  
  const { data: usersData, isLoading } = useAdminUsers({
    cursor,
    limit: 50,
    role: "ARTISAN"
  });
  
  const { verifyArtisan, rejectArtisanVerification } = useAdminUserMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  // Filter unverified artisans for this view
  const unverifiedArtisans = (usersData?.data || []).filter((user: any) => !user.artisanVerified);
  const meta = usersData?.meta;

  const handleVerify = (userId: string) => {
    if (confirm("Are you sure you want to verify this artisan? This grants them marketplace access.")) {
      verifyArtisan.mutate(userId, {
        onSuccess: () => toast.success("Artisan verified successfully"),
        onError: (err: any) => toast.error(err.message || "Failed to verify artisan")
      });
    }
  };

  const handleReject = (userId: string) => {
    if (confirm("Are you sure you want to reject this verification? The artisan will be notified.")) {
      rejectArtisanVerification.mutate(userId, {
        onSuccess: () => toast.success("Verification rejected"),
        onError: (err: any) => toast.error(err.message || "Failed to reject verification")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Verification</h1>
        <p className="text-muted-foreground mt-1">Review and approve artisan profiles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Artisan Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unverifiedArtisans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      No pending verifications found on this page.
                    </TableCell>
                  </TableRow>
                ) : (
                  unverifiedArtisans.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending Review</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(user.id)}
                          disabled={rejectArtisanVerification.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleVerify(user.id)}
                          disabled={verifyArtisan.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing pending out of {usersData?.data?.length || 0} fetched artisans
            </div>
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor((meta as any)?.nextCursor)}
            >
              Load More Artisans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
