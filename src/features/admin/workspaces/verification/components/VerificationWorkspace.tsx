"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { CheckCircle, XCircle, ShieldCheck, Clock, Users, ShieldAlert, Search } from "lucide-react";
import { toast } from "sonner";

export function VerificationWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "verified" | "unverified">("all");
  
  const { data: usersData, isLoading } = useAdminUsers({
    cursor,
    limit: 50,
    ...(search ? { search } : {})
  });
  
  const { verifyArtisan, rejectArtisanVerification } = useAdminUserMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const allUsers = Array.isArray(usersData?.data) ? usersData.data : [];
  const meta = usersData?.meta;

  // Calculate metrics
  const totalUsersCount = allUsers.length;
  const verifiedCount = allUsers.filter((u: any) => u.artisanVerified).length;
  const pendingCount = allUsers.filter((u: any) => !u.artisanVerified && u.role === "ARTISAN").length;
  const unverifiedCount = allUsers.filter((u: any) => !u.artisanVerified).length;

  // Filter users based on active tab
  const filteredUsers = allUsers.filter((user: any) => {
    if (activeTab === "pending") {
      return !user.artisanVerified && user.role === "ARTISAN";
    }
    if (activeTab === "verified") {
      return Boolean(user.artisanVerified);
    }
    if (activeTab === "unverified") {
      return !user.artisanVerified;
    }
    return true; // "all"
  });

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCursor(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Verification</h1>
        <p className="text-muted-foreground mt-1">Review, approve, and manage artisan verification status across all users.</p>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card p-4 border border-border">
          <div className="flex justify-between items-start text-muted-foreground mb-1">
            <span className="text-xs font-medium">All Accounts</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalUsersCount}</div>
        </Card>

        <Card className="bg-card p-4 border border-border">
          <div className="flex justify-between items-start text-muted-foreground mb-1">
            <span className="text-xs font-medium">Verified Artisans</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{verifiedCount}</div>
        </Card>

        <Card className="bg-card p-4 border border-border">
          <div className="flex justify-between items-start text-muted-foreground mb-1">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
        </Card>

        <Card className="bg-card p-4 border border-border">
          <div className="flex justify-between items-start text-muted-foreground mb-1">
            <span className="text-xs font-medium">Unverified</span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-muted-foreground">{unverifiedCount}</div>
        </Card>
      </div>

      {/* Main Verification Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b sm:border-b-0 pb-2 sm:pb-0 text-sm font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                All Users ({allUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 ${
                  activeTab === "pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab("verified")}
                className={`px-3 py-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 ${
                  activeTab === "verified"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => setActiveTab("unverified")}
                className={`px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
                  activeTab === "unverified"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Unverified ({unverifiedCount})
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search user or email..." 
                className="px-3 py-1.5 border rounded-md text-xs w-full sm:w-60 bg-background"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="sm">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User / Artisan</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No users found for the selected tab & filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: any) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="font-medium flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[11px]">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.artisanVerified ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 w-max text-xs">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified
                          </Badge>
                        ) : user.role === "ARTISAN" ? (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1 w-max text-xs">
                            <Clock className="h-3.5 w-3.5" /> Pending Review
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground w-max text-xs">
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {!user.artisanVerified ? (
                          <>
                            {user.role === "ARTISAN" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReject(user.id)}
                                disabled={rejectArtisanVerification.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1.5 text-destructive" />
                                Reject
                              </Button>
                            )}
                            <Button 
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleVerify(user.id)}
                              disabled={verifyArtisan.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Approve
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(user.id)}
                            disabled={rejectArtisanVerification.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1.5 text-destructive" />
                            Revoke Verification
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {allUsers.length} users
            </div>
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor((meta as any)?.nextCursor)}
            >
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
