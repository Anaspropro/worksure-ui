"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/shared/api/client";

export default function AdminTaxonomyPage() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["category-suggestions"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/taxonomy/suggestions" as any, { params: { query: { status: "pending", cursor: "", limit: "50" } } });
      if (error) throw error;
      return data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.PATCH("/admin/taxonomy/suggestions/{id}/approve" as any, {
        params: { path: { id } }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-suggestions"] });
      toast.success("Category approved");
    },
    onError: (err: any) => toast.error(err?.message || err?.error?.message || "Failed to approve category")
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/admin/taxonomy/suggestions/{id}" as any, {
        params: { path: { id } }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-suggestions"] });
      toast.success("Category rejected");
    },
    onError: (err: any) => toast.error(err?.message || err?.error?.message || "Failed to reject category")
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Category Suggestions</h1>
      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Suggested By</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(response as any)?.data?.map((suggestion: any) => (
              <tr key={suggestion.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-6 py-4 font-medium">{suggestion.name}</td>
                <td className="px-6 py-4">{suggestion.description || "-"}</td>
                <td className="px-6 py-4">{suggestion.status}</td>
                <td className="px-6 py-4">{suggestion.suggestedBy?.name || suggestion.suggestedByUserId}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {suggestion.status === "PENDING" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => rejectMutation.mutate(suggestion.id)} disabled={rejectMutation.isPending || approveMutation.isPending}>
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => approveMutation.mutate(suggestion.id)} disabled={rejectMutation.isPending || approveMutation.isPending}>
                        Approve
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!(response as any)?.data?.length && (
              <tr>
                <td colSpan={5} className="text-center h-24 text-muted-foreground">
                  No suggestions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
