"use client";

import { useState } from "react";
import { useAdminReviews, useModerateReview } from "@/features/admin/api/useAdminReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { User, MessageSquare, AlertTriangle, CheckCircle, ShieldBan } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export function ReviewModerationWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  const { data: reviewsData, isLoading } = useAdminReviews({
    cursor,
    limit: "20",
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {})
  });
  
  const moderateReview = useModerateReview();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const reviews = reviewsData?.data || [];
  const meta = reviewsData?.meta;

  const handleModerate = (reviewId: string, action: "FLAG" | "LOCK" | "RESTORE") => {
    if (confirm(`Are you sure you want to ${action.toLowerCase()} this review?`)) {
      const reason = prompt("Enter moderation reason (optional):");
      moderateReview.mutate({ reviewId, action, reason: reason || undefined }, {
        onSuccess: () => toast.success(`Review ${action.toLowerCase()}ed successfully. Target JSS has been recalculated.`),
        onError: (err: any) => toast.error(err.message || "Failed to moderate review")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Moderation</h1>
          <p className="text-muted-foreground mt-1">Monitor marketplace feedback and enforce community guidelines.</p>
        </div>
        
        <div className="w-48">
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCursor(undefined); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="VISIBLE">Visible</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="FLAGGED">Flagged</SelectItem>
              <SelectItem value="LOCKED">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review Info</TableHead>
                  <TableHead>Author / Target</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Moderation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No reviews found.</TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review: any) => (
                    <TableRow key={review.id}>
                      <TableCell className="max-w-[300px]">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <MessageSquare className="size-4 text-muted-foreground shrink-0" />
                          <span className="truncate" title={review.jobTitle}>{review.jobTitle || "Direct Contract"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground truncate" title={review.comment || "No comment"}>
                          "{review.comment || "No comment provided"}"
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(review.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center gap-2">
                          <User className="size-3 text-muted-foreground" />
                          <span className="text-muted-foreground">From:</span> {review.authorName}
                        </div>
                        <div className="text-sm flex items-center gap-2 mt-1">
                          <User className="size-3 text-muted-foreground" />
                          <span className="text-muted-foreground">To:</span> {review.targetName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-lg flex items-center">
                          {review.rating.toFixed(1)} <span className="text-yellow-400 ml-1 text-xl">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {review.status === "VISIBLE" && <Badge variant="default" className="bg-green-600 hover:bg-green-700">Visible</Badge>}
                        {review.status === "SUBMITTED" && <Badge variant="secondary">Pending (Blind)</Badge>}
                        {review.status === "FLAGGED" && <Badge variant="destructive">Flagged</Badge>}
                        {review.status === "LOCKED" && <Badge variant="outline" className="text-red-500 border-red-500">Locked (Hidden)</Badge>}
                        {review.status === "DRAFT" && <Badge variant="outline">Draft</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {review.status !== "LOCKED" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleModerate(review.id, 'LOCK')}
                              disabled={moderateReview.isPending}
                              title="Hide this review and exclude it from reputation"
                            >
                              <ShieldBan className="h-4 w-4" />
                            </Button>
                          )}
                          {review.status !== "FLAGGED" && review.status !== "LOCKED" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              onClick={() => handleModerate(review.id, 'FLAG')}
                              disabled={moderateReview.isPending}
                              title="Flag review for further investigation"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                          {(review.status === "LOCKED" || review.status === "FLAGGED") && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleModerate(review.id, 'RESTORE')}
                              disabled={moderateReview.isPending}
                              title="Restore review to public visibility"
                            >
                              <CheckCircle className="h-4 w-4" />
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
              Showing {reviews.length} reviews
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
