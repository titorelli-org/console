import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { AccessTokenCreatedResultVm } from "@/types/access-tokens";

export const useRegenerateToken = (accountId: string) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    async mutationFn({ tokenId }: { tokenId: string }) {
      const { data } = await apiClient.post<AccessTokenCreatedResultVm>(
        `/api/accounts/${accountId}/access-tokens/${tokenId}/regenerate`,
        {
          tokenId,
        },
      );

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountId, "access-tokens"],
      });
    },
  });
};
