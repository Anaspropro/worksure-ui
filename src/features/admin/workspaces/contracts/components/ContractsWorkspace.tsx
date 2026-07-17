"use client";

import { useState } from "react";
import { useAdminContracts } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { FileText } from "lucide-react";

export function ContractsWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const { data: contractsData, isLoading } = useAdminContracts({
    cursor,
    limit: 20,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {})
  });

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const contracts = contractsData?.data || [];
  const meta = contractsData?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCursor(undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contract Operations</h1>
        <p className="text-muted-foreground mt-1">Monitor system contracts and escrow statuses.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>System Contracts</CardTitle>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCursor(undefined);
                }}
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="FUNDED">Funded (Escrow)</option>
                <option value="ACTIVE">Active</option>
                <option value="CLIENT_CONFIRMED">Client Confirmed</option>
                <option value="READY_FOR_PAYOUT">Ready for Payout</option>
                <option value="PAID_OUT">Paid Out</option>
                <option value="DISPUTED">Disputed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No contracts found.</TableCell>
                  </TableRow>
                ) : (
                  contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2 font-mono text-sm">
                          <FileText className="size-4 text-muted-foreground" />
                          {contract.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            contract.status === "PAID_OUT" ? "default" :
                            contract.status === "DISPUTED" ? "destructive" :
                            contract.status === "FUNDED" ? "secondary" : "outline"
                          }
                          className={contract.status === "PAID_OUT" ? "bg-green-600" : ""}
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(contract.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(contract.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {contracts.length} contracts
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
