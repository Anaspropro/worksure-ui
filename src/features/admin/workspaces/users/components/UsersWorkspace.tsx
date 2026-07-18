"use client";

import { useState } from "react";
import { useAdminUsers, useAdminUserMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { toast } from "sonner";

export function UsersWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  
  const { data: usersData, isLoading } = useAdminUsers({
    cursor,
    limit: 20,
    ...(search ? { search } : {})
  });
  
  const { banUser, unbanUser } = useAdminUserMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const users = usersData?.data || [];
  const meta = usersData?.meta;

  const handleBan = (userId: string) => {
    if (confirm("Are you sure you want to ban this user? They will immediately lose access to the platform.")) {
      banUser.mutate(userId, {
        onSuccess: () => toast.success("User has been banned"),
        onError: (err: any) => toast.error(err.message || "Failed to ban user")
      });
    }
  };

  const handleUnban = (userId: string) => {
    if (confirm("Are you sure you want to restore this user's access?")) {
      unbanUser.mutate(userId, {
        onSuccess: () => toast.success("User access restored"),
        onError: (err: any) => toast.error(err.message || "Failed to restore user")
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
        <h1 className="text-3xl font-bold tracking-tight">User Operations</h1>
        <p className="text-muted-foreground mt-1">Manage users, view activity, and handle suspensions.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Accounts</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by name or email" 
                className="px-3 py-2 border rounded-md text-sm w-64"
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
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.status === "BANNED" ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>User Details - {user.name}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                                    <p className="text-sm font-mono">{user.id}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                    <p className="text-sm">{user.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                                    <Badge variant="outline">{user.role}</Badge>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                    {user.status === "BANNED" ? (
                                      <Badge variant="destructive">Banned</Badge>
                                    ) : (
                                      <Badge variant="default" className="bg-green-600">Active</Badge>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                                    <p className="text-sm">{format(new Date(user.createdAt), "PPP")}</p>
                                  </div>
                                  {user.artisanProfile && (
                                    <div className="col-span-2 mt-4">
                                      <h4 className="text-sm font-semibold mb-2">Artisan Profile</h4>
                                      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                                        <div>
                                          <span className="text-xs text-muted-foreground block">Profession</span>
                                          <span className="text-sm">{user.artisanProfile.profession || "N/A"}</span>
                                        </div>
                                        <div>
                                          <span className="text-xs text-muted-foreground block">Rating</span>
                                          <span className="text-sm">{user.artisanProfile.rating} / 5</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {user.clientProfile && (
                                    <div className="col-span-2 mt-4">
                                      <h4 className="text-sm font-semibold mb-2">Client Profile</h4>
                                      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                                        <div>
                                          <span className="text-xs text-muted-foreground block">Company</span>
                                          <span className="text-sm">{user.clientProfile.companyName || "N/A"}</span>
                                        </div>
                                        <div>
                                          <span className="text-xs text-muted-foreground block">Total Spent</span>
                                          <span className="text-sm">{user.clientProfile.totalSpent}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {user.status === "BANNED" ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUnban(user.id)}
                              disabled={unbanUser.isPending}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Unban
                            </Button>
                          ) : (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleBan(user.id)}
                              disabled={banUser.isPending}
                            >
                              <ShieldAlert className="h-4 w-4 mr-2" />
                              Ban
                            </Button>
                          )}
                        </div>
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
