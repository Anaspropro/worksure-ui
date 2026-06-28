"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronRight,
  User as UserIcon,
  X,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Calendar,
  Wallet,
  BriefcaseBusiness,
  Activity
} from "lucide-react";
import { useAdminUserDetail, useAdminUsers, useBanUser, useUnbanUser, useVerifyArtisan } from "@/hooks/useAdmin";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUserRecord } from "@/types";

export default function AdminUsersWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const currentCursor = cursors[page - 1];
  const itemsPerPage = 20;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset page on search
      setCursors([undefined]);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: usersResponse, isLoading: usersLoading } = useAdminUsers({
    cursor: currentCursor,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });

  const verifyArtisanMutation = useVerifyArtisan();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();

  const detailQuery = useAdminUserDetail(selectedUserId ?? undefined, {
    enabled: Boolean(selectedUserId) && isModalOpen
  });

  const users = usersResponse?.data || [];

  const handleReviewClick = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUserId(null), 300); // clear after animation
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge variant="secondary" className="bg-success-50 text-success-700 border-success-200">Active</Badge>;
      case "BANNED": return <Badge variant="destructive">Banned</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          User Management
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Review verification readiness, account status, and moderation actions from one queue.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Queue</CardTitle>
              <CardDescription>
                Total users: {usersResponse?.meta?.total ? String(usersResponse.meta.total) : (usersLoading ? "Loading..." : users.length)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((user: AdminUserRecord) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="size-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className="lowercase text-[10px] tracking-wider">
                            {user.role}
                          </Badge>
                          {user.role === "ARTISAN" && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              {user.artisanVerified ? (
                                <><CheckCircle2 className="size-3 text-success" /> Verified</>
                              ) : (
                                <><ShieldAlert className="size-3 text-warning" /> Pending KYC</>
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReviewClick(user.id)}
                          className="transition-opacity"
                        >
                          Review user
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || usersLoading}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => {
              if (usersResponse?.meta?.nextCursor && page === cursors.length) {
                setCursors(prev => [...prev, usersResponse.meta!.nextCursor as string]);
              }
              setPage(p => p + 1);
            }} disabled={!usersResponse?.meta?.nextCursor || usersLoading}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── User Detail Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && selectedUserId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-[90vw] md:max-w-4xl -translate-x-1/2 -translate-y-1/2 max-h-[85vh] flex flex-col rounded-xl overflow-hidden shadow-lg bg-card border border-border"
            >
              <Card className="border-none shadow-none bg-transparent flex flex-col h-full overflow-hidden">
                <CardHeader className="sticky top-0 z-10 bg-card border-b border-border pb-4 rounded-t-xl shrink-0 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">User Profile Review</CardTitle>
                    <CardDescription>
                      Review identity, wallet state, recent transactions, and marketplace activity.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeModal} className="shrink-0 -mt-2 -mr-2">
                    <X className="size-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 overflow-y-auto flex-1">
                  {detailQuery.isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : detailQuery.data?.data ? (
                    <div className="space-y-8">
                      {/* Top Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="size-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{detailQuery.data.data.name}</h3>
                            <p className="text-sm text-muted-foreground">{detailQuery.data.data.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {detailQuery.data.data.role === "ARTISAN" && !detailQuery.data.data.artisanVerified && (
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => {
                                verifyArtisanMutation.mutate(selectedUserId, {
                                  onSuccess: () => toast.success("Artisan verified."),
                                  onError: (error) => toast.error(error.message || "Unable to verify artisan."),
                                });
                              }}
                              disabled={verifyArtisanMutation.status === "pending"}
                            >
                              <ShieldCheck className="size-4 mr-2" />
                              Verify Artisan
                            </Button>
                          )}
                          {detailQuery.data.data.status === "ACTIVE" && detailQuery.data.data.role !== "ADMIN" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                banUserMutation.mutate(selectedUserId, {
                                  onSuccess: () => toast.success("User banned."),
                                  onError: (error) => toast.error(error.message || "Unable to ban user."),
                                });
                              }}
                              disabled={banUserMutation.status === "pending"}
                            >
                              <Ban className="size-4 mr-2" />
                              Ban User
                            </Button>
                          )}
                          {detailQuery.data.data.status === "BANNED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                unbanUserMutation.mutate(selectedUserId, {
                                  onSuccess: () => toast.success("User restored."),
                                  onError: (error) => toast.error(error.message || "Unable to restore user."),
                                });
                              }}
                              disabled={unbanUserMutation.status === "pending"}
                            >
                              <CheckCircle2 className="size-4 mr-2 text-success" />
                              Restore Account
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Calendar className="size-4" />
                            <p className="text-sm font-medium">Last Login</p>
                          </div>
                          <p className="text-lg font-semibold text-foreground">
                            {formatDate(detailQuery.data.data.lastLoginAt)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Wallet className="size-4" />
                            <p className="text-sm font-medium">Wallet Available</p>
                          </div>
                          <p className="text-lg font-semibold text-foreground">
                            {detailQuery.data.data.wallet ? formatCurrency(detailQuery.data.data.wallet.available) : "No wallet"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <Activity className="size-4" />
                            <p className="text-sm font-medium">Transactions</p>
                          </div>
                          <p className="text-lg font-semibold text-foreground">
                            {detailQuery.data.data.transactions.length} total
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <BriefcaseBusiness className="size-4" />
                            <p className="text-sm font-medium">Platform Role</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{detailQuery.data.data.role}</Badge>
                            {getStatusBadge(detailQuery.data.data.status)}
                          </div>
                        </div>
                      </div>

                      {/* Artisan Profile (If applicable) */}
                      {detailQuery.data.data.artisanProfile && (
                        <div className="rounded-xl border border-border bg-muted/10 p-5">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <BriefcaseBusiness className="size-4 text-primary" />
                            Artisan Profile
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Bio</p>
                              <p className="text-sm leading-relaxed">
                                {detailQuery.data.data.artisanProfile.bio || "No bio provided."}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {detailQuery.data.data.artisanProfile.skills?.length ? (
                                  detailQuery.data.data.artisanProfile.skills.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="font-normal">{skill}</Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No skills listed.</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Transactions */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="bg-muted/30 px-4 py-3 border-b border-border">
                            <h4 className="font-semibold text-foreground text-sm">Recent Transactions</h4>
                          </div>
                          <div className="p-0">
                            {detailQuery.data.data.transactions.length > 0 ? (
                              <div className="divide-y divide-border">
                                {detailQuery.data.data.transactions.slice(0, 5).map((tx) => (
                                  <div key={tx.id} className="flex items-center justify-between p-4 text-sm">
                                    <div>
                                      <p className="font-medium text-foreground capitalize">{tx.type.toLowerCase().replace(/_/g, ' ')}</p>
                                      <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">{formatCurrency(tx.amount)}</p>
                                      <Badge variant="outline" className="text-[10px] mt-1 capitalize">{tx.status.toLowerCase()}</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-6 text-center text-sm text-muted-foreground">
                                No transactions found for this user.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Marketplace Activity */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="bg-muted/30 px-4 py-3 border-b border-border">
                            <h4 className="font-semibold text-foreground text-sm">Marketplace Activity</h4>
                          </div>
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Client Jobs Posted</p>
                                <p className="text-lg font-medium">{detailQuery.data.data.activity.clientJobs.length}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Artisan Jobs Taken</p>
                                <p className="text-lg font-medium">{detailQuery.data.data.activity.artisanJobs.length}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Client Contracts</p>
                                <p className="text-lg font-medium">{detailQuery.data.data.activity.clientContracts.length}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Artisan Contracts</p>
                                <p className="text-lg font-medium">{detailQuery.data.data.activity.artisanContracts.length}</p>
                              </div>
                              <div className="space-y-1 col-span-2 mt-2 pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground">Reviews Received</p>
                                <p className="text-lg font-medium">{detailQuery.data.data.activity.receivedReviews.length}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      Could not load user details.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
