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
    </div>
  );
}
