import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BotCreateRequestDataVm,
  BotState,
  BotStateChangeResultVm,
  BotUpdateRequestDataVm,
} from "@/types/bot";
import { useApiClient } from "./use-api-client";

export const useBotControls = (accountId: string) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: createMutation } = useMutation({
    async mutationFn(params: BotCreateRequestDataVm) {
      const { data } = await apiClient.post<{ ok: boolean }>(
        `/api/accounts/${accountId}/bots`,
        params,
      );

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountId, "bots"],
      });
    },
  });

  const { mutate: updateMutation } = useMutation({
    async mutationFn(params: BotUpdateRequestDataVm) {
      const { data } = await apiClient.post<{ ok: boolean }>(
        `/api/accounts/${accountId}/bots/${params.id}`,
        params,
      );

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountId, "bots"],
      });
    },
  });

  const { mutate: stateMutation } = useMutation({
    async mutationFn({ id, state }: { id: string; state: BotState }) {
      const { data } = await apiClient.post<BotStateChangeResultVm>(
        `/api/accounts/${accountId}/bots/${id}/state`,
        { state },
      );

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountId, "bots"],
      });
    },
  });

  const { mutate: removeMutation } = useMutation({
    async mutationFn({ id }: { id: string }) {
      const { data } = await apiClient.delete<void>(
        `/api/accounts/${accountId}/bots/${id}`,
      );

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountId, "bots"],
      });
    },
  });

  return {
    createMutation,
    stateMutation,
    removeMutation,
    updateMutation,
  };
};
