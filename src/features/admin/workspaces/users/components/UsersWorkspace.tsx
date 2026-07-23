"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserMutations, useAdminUserDetail } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Star,
  CheckCircle2,
  Clock,
  Copy,
  Briefcase,
  FileText,
  Building2,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";

export function UsersWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "transactions">("overview");

  const { data: usersData, isLoading } = useAdminUsers({
    cursor,
    limit: 20,
    ...(search ? { search } : {})
  });

  const { data: userDetailResponse, isLoading: detailLoading } = useAdminUserDetail(
    selectedUserId ?? undefined
  );
  const userDetail = userDetailResponse as any;

  const { banUser, unbanUser, verifyArtisan } = useAdminUserMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const users = usersData?.data || [];
  const meta = usersData?.meta;

  const handleBan = (userId: string) => {
    if (confirm("Are you sure you want to ban this user? They will immediately lose access to the platform.")) {
      banUser.mutate(userId, {
        onSuccess: () => {
          toast.success("User has been banned");
        },
        onError: (err: any) => toast.error(err.message || "Failed to ban user")
      });
    }
  };

  const handleUnban = (userId: string) => {
    if (confirm("Are you sure you want to restore this user's access?")) {
      unbanUser.mutate(userId, {
        onSuccess: () => {
          toast.success("User access restored");
        },
        onError: (err: any) => toast.error(err.message || "Failed to restore user")
      });
    }
  };

  const handleVerify = (userId: string) => {
    if (confirm("Are you sure you want to verify this artisan?")) {
      toast.info("Verifying artisan...");
      verifyArtisan.mutate(userId, {
        onSuccess: () => {
          toast.success("Artisan verified successfully!");
        },
        onError: (err: any) => toast.error(err.message || "Failed to verify artisan")
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCursor(undefined);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const activeUser = userDetail || users.find((u: any) => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Operations</h1>
        <p className="text-muted-foreground mt-1">Manage users, view detailed activity, and handle suspensions.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Accounts</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by name or email" 
                className="px-3 py-2 border rounded-md text-sm w-64 bg-background"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No users found.</TableCell>
                  </TableRow>
                ) : (
                  users.map((user: any) => (
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
                        {user.status === "BANNED" ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setActiveTab("overview");
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          Review
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
              Showing {users.length} users
            </div>
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor((meta as any)?.nextCursor)}
            >
              Next Page
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DETAILED USER REVIEW MODAL */}
      <Dialog open={Boolean(selectedUserId)} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-border shadow-2xl bg-card overflow-hidden flex flex-col">
          {activeUser && (
            <>
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white text-xl font-bold flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                      {activeUser.name ? activeUser.name.slice(0, 2).toUpperCase() : "US"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">{activeUser.name}</h2>
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-mono text-xs">
                          {activeUser.role}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-indigo-400" />
                          {activeUser.email}
                        </span>
                        {activeUser.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-emerald-400" />
                            {activeUser.phone}
                          </span>
                        )}
                        <button 
                          onClick={() => copyToClipboard(activeUser.id, "User ID")}
                          className="flex items-center gap-1 font-mono text-[11px] hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-all"
                          title="Click to copy ID"
                        >
                          <Copy className="h-3 w-3" />
                          ID: {activeUser.id.slice(0, 8)}...
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {activeUser.status === "BANNED" ? (
                      <Badge variant="destructive" className="px-3 py-1 text-xs">Banned</Badge>
                    ) : (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b bg-muted/20 px-6 flex gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserIcon className="h-4 w-4" /> Overview & Profile
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "activity"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Activity className="h-4 w-4" /> Jobs & Contracts
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "transactions"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wallet className="h-4 w-4" /> Wallet & Financials
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {detailLoading && !userDetail ? (
                  <div className="py-12 text-center text-muted-foreground">
                    Loading detailed user profile...
                  </div>
                ) : (
                  <>
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <Card className="bg-card p-4 border border-border">
                            <div className="flex justify-between items-start text-muted-foreground mb-1">
                              <span className="text-xs font-medium">Wallet Balance</span>
                              <Wallet className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {formatCurrency(activeUser.wallet?.balance ?? 0)}
                            </div>
                            {activeUser.wallet?.frozen ? (
                              <p className="text-[11px] text-amber-600 mt-0.5">
                                {formatCurrency(activeUser.wallet.frozen)} frozen
                              </p>
                            ) : null}
                          </Card>

                          <Card className="bg-card p-4 border border-border">
                            <div className="flex justify-between items-start text-muted-foreground mb-1">
                              <span className="text-xs font-medium">Verification</span>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="text-sm font-bold text-foreground">
                              {activeUser.artisanVerified ? (
                                <Badge className="bg-emerald-600">Verified Artisan</Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">Standard User</Badge>
                              )}
                            </div>
                          </Card>

                          <Card className="bg-card p-4 border border-border">
                            <div className="flex justify-between items-start text-muted-foreground mb-1">
                              <span className="text-xs font-medium">Joined Date</span>
                              <Calendar className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {activeUser.createdAt ? format(new Date(activeUser.createdAt), "MMM d, yyyy") : "N/A"}
                            </div>
                          </Card>

                          <Card className="bg-card p-4 border border-border">
                            <div className="flex justify-between items-start text-muted-foreground mb-1">
                              <span className="text-xs font-medium">Last Active</span>
                              <Clock className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {activeUser.lastLoginAt ? format(new Date(activeUser.lastLoginAt), "MMM d, HH:mm") : "Never"}
                            </div>
                          </Card>
                        </div>

                        {/* Artisan Profile Section */}
                        {activeUser.artisanProfile && (
                          <Card className="border border-border p-5 space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Artisan Profile & Credentials
                              </h3>
                              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                {activeUser.artisanProfile.rating ?? 0} / 5 ({activeUser.artisanProfile.reviewCount ?? 0} reviews)
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-xs text-muted-foreground block font-medium">Profession</span>
                                <span className="font-semibold text-foreground">{activeUser.artisanProfile.profession || "General Artisan"}</span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block font-medium">Experience Level</span>
                                <span className="font-semibold text-foreground">{activeUser.artisanProfile.experience || "Not specified"}</span>
                              </div>
                              
                              {activeUser.artisanProfile.bio && (
                                <div className="col-span-2">
                                  <span className="text-xs text-muted-foreground block font-medium mb-1">Biography</span>
                                  <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg leading-relaxed">
                                    &quot;{activeUser.artisanProfile.bio}&quot;
                                  </p>
                                </div>
                              )}

                              {activeUser.artisanProfile.skills && activeUser.artisanProfile.skills.length > 0 && (
                                <div className="col-span-2">
                                  <span className="text-xs text-muted-foreground block font-medium mb-2">Skills & Specializations</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {activeUser.artisanProfile.skills.map((skill: string) => (
                                      <Badge key={skill} variant="secondary" className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}

                        {/* Client Profile Section */}
                        {(activeUser.clientProfile || activeUser.role === 'CLIENT') && (
                          <Card className="border border-border p-5 space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                Client Activity Profile
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="bg-muted/30 p-3 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground block font-medium">Total Jobs Posted</span>
                                <span className="text-lg font-bold text-foreground">{activeUser.clientProfile?.totalJobs ?? activeUser.activity?.clientJobs?.length ?? 0}</span>
                              </div>
                              <div className="bg-muted/30 p-3 rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground block font-medium">Total Spent</span>
                                <span className="text-lg font-bold text-emerald-600">{formatCurrency(activeUser.clientProfile?.totalSpent ?? 0)}</span>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* ACTIVITY & JOBS TAB */}
                    {activeTab === "activity" && (
                      <div className="space-y-6">
                        {/* Jobs List */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Jobs History
                          </h3>
                          {(!activeUser.activity?.clientJobs?.length && !activeUser.activity?.artisanJobs?.length) ? (
                            <div className="text-xs text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                              No recorded job activity for this user.
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {[...(activeUser.activity?.clientJobs || []), ...(activeUser.activity?.artisanJobs || [])].map((job: any) => (
                                <div key={job.id} className="flex justify-between items-center p-3 rounded-lg border bg-muted/20 text-xs">
                                  <div>
                                    <div className="font-semibold text-foreground">{job.title}</div>
                                    <div className="text-muted-foreground text-[11px]">ID: {job.id}</div>
                                  </div>
                                  <Badge variant="outline">{job.status}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Contracts List */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            Contracts History
                          </h3>
                          {(!activeUser.activity?.clientContracts?.length && !activeUser.activity?.artisanContracts?.length) ? (
                            <div className="text-xs text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                              No active or historic contracts found.
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {[...(activeUser.activity?.clientContracts || []), ...(activeUser.activity?.artisanContracts || [])].map((contract: any) => (
                                <div key={contract.id} className="flex justify-between items-center p-3 rounded-lg border bg-muted/20 text-xs">
                                  <div>
                                    <div className="font-semibold text-foreground">{formatCurrency(contract.amount)}</div>
                                    <div className="text-muted-foreground text-[11px]">Contract #{contract.id.slice(0, 8)}</div>
                                  </div>
                                  <Badge variant="secondary">{contract.status}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TRANSACTIONS TAB */}
                    {activeTab === "transactions" && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-primary" />
                          Recent Wallet Ledger Transactions
                        </h3>
                        {!activeUser.transactions?.length ? (
                          <div className="text-xs text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                            No ledger transactions recorded yet.
                          </div>
                        ) : (
                          <div className="rounded-lg border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/40 text-xs">
                                  <TableHead>Type</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activeUser.transactions.map((tx: any) => (
                                  <TableRow key={tx.id} className="text-xs">
                                    <TableCell className="font-semibold">{tx.type}</TableCell>
                                    <TableCell className="font-bold text-foreground">{formatCurrency(tx.amount)}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-[10px]">{tx.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {tx.createdAt ? format(new Date(tx.createdAt), "MMM d, HH:mm") : "N/A"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Footer Bar */}
              <div className="p-4 bg-muted/30 border-t flex flex-col sm:flex-row gap-3 justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => setSelectedUserId(null)}>
                  Close
                </Button>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {activeUser.role === 'ARTISAN' && !activeUser.artisanVerified && (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleVerify(activeUser.id)}
                      disabled={verifyArtisan.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Verify Artisan
                    </Button>
                  )}

                  {activeUser.status === "BANNED" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnban(activeUser.id)}
                      disabled={unbanUser.isPending}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" />
                      Restore Access (Unban)
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleBan(activeUser.id)}
                      disabled={banUser.isPending}
                    >
                      <ShieldAlert className="h-4 w-4 mr-1.5" />
                      Ban Account
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
