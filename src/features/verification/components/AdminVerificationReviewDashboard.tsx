import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { format } from 'date-fns';

export const AdminVerificationReviewDashboard = () => {
  const queryClient = useQueryClient();

  const { data: pending, isLoading } = useQuery({
    queryKey: ['admin-verification', 'pending'],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/admin/verification/marketplace/pending');
      if (error) throw error;
      return data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await apiClient.POST('/admin/verification/marketplace/{userId}/approve', {
        params: { path: { userId } }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification', 'pending'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string, reason: string }) => {
      const { data, error } = await apiClient.POST('/admin/verification/marketplace/{userId}/reject', {
        params: { path: { userId } },
        body: { reason }
      } as any);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification', 'pending'] });
    }
  });

  if (isLoading) return <div>Loading pending verifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Marketplace Verification Queue</h2>
        <p className="text-muted-foreground">
          Review artisan profiles for marketplace trust.
        </p>
      </div>

      <div className="grid gap-4">
        {(pending as unknown as any[])?.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No pending verifications to review.
            </CardContent>
          </Card>
        ) : (
          (pending as unknown as any[])?.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{item.user?.firstName} {item.user?.lastName}</h3>
                    <Badge variant="secondary">PENDING</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Email: {item.user?.email}</p>
                  <p className="text-sm text-muted-foreground">Submitted: {format(new Date(item.updatedAt), 'PPP')}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const reason = prompt('Reason for rejection:');
                      if (reason) {
                        rejectMutation.mutate({ userId: item.userId, reason });
                      }
                    }}
                    disabled={rejectMutation.isPending || approveMutation.isPending}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (confirm('Approve this artisan for the marketplace?')) {
                        approveMutation.mutate(item.userId);
                      }
                    }}
                    disabled={rejectMutation.isPending || approveMutation.isPending}
                  >
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
