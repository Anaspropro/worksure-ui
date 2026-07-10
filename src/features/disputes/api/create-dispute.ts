import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { CreateDisputeInput } from "../schemas";
import { Dispute } from "../types";
import { adminKeys, contractKeys } from "@/shared/api/queryKeys";
import { toast } from "sonner";
import { components } from "@/shared/api/generated/schema";

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDisputeInput): Promise<Dispute> => {
      const { data: responseData, error, response } = await apiClient.POST("/disputes", {
        body: data as unknown as components["schemas"]["CreateDisputeDto"]
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return responseData as unknown as Dispute;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(variables.contractId),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.disputes({}),
      });
      toast.success("Dispute raised successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to raise dispute");
    },
  });
}
