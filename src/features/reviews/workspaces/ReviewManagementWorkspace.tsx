"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useEligibleReviews, useMyReviews } from "../api";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Star, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ReviewManagementWorkspace() {
  const { data: eligibleReviews, isLoading: loadingEligible } = useEligibleReviews();
  const { data: pastReviews, isLoading: loadingPast } = useMyReviews();
  
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const handleOpenReview = (contractId: string, targetId: string) => {
    setSelectedContractId(contractId);
    setSelectedTargetId(targetId);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews & Reputation</h1>
        <p className="text-gray-500">Manage your pending feedback and view your past reviews.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Reviews
            {eligibleReviews && eligibleReviews.length > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs">
                {eligibleReviews.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Review History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {loadingEligible && <p className="text-gray-500 py-8 text-center animate-pulse">Checking eligible contracts...</p>}
            
            {!loadingEligible && eligibleReviews?.length === 0 && (
              <Card className="bg-gray-50/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">All Caught Up!</h3>
                  <p className="text-gray-500 mt-1 max-w-sm">
                    You don't have any pending contracts that require a review at this moment.
                  </p>
                </CardContent>
              </Card>
            )}

            {eligibleReviews?.map((eligibility: any) => (
              <Card key={eligibility.id} className="hover:border-indigo-200 transition-colors">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{eligibility.contract?.job?.title || "Contract Review"}</CardTitle>
                    <CardDescription>
                      Reviewing: <span className="font-medium text-gray-900">{eligibility.target?.name || "User"}</span>
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenReview(eligibility.contractId, eligibility.targetId)}>
                    Leave Review
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md inline-block">
                    Expires {formatDistanceToNow(new Date(eligibility.expiresAt), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-4">
            {loadingPast && <p className="text-gray-500 py-8 text-center animate-pulse">Loading past reviews...</p>}
            
            {!loadingPast && pastReviews?.length === 0 && (
              <Card className="bg-gray-50/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Star className="w-8 h-8 text-gray-300 mb-3" />
                  <p className="text-gray-500">You haven't submitted any reviews yet.</p>
                </CardContent>
              </Card>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {pastReviews?.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedContractId && selectedTargetId && (
        <ReviewForm
          contractId={selectedContractId}
          targetId={selectedTargetId}
          open={!!selectedContractId}
          onOpenChange={(open) => !open && setSelectedContractId(null)}
        />
      )}
    </div>
  );
}
