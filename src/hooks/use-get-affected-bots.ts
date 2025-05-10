import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { BotVm } from "@/types/bot";

export const useGetAffectedBots = (
  accountId: string,
  accessTokenId: string,
) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["accounts", accountId, "bots", "affected", { accessTokenId }],
    async queryFn() {
      const { data } = await apiClient.get<BotVm[]>(
        `/api/accounts/${accountId}/bots/affected`,
        {
          params: { accessTokenId },
        },
      );

      return data;
    },
  });
};
