import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { UserContactVm } from "@/types/my-profile";

export const useContactControls = (userId: string) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async ({ id }: { id: UserContactVm["id"] }) => {
      const { data } = await apiClient.delete<void>(
        `/api/users/${userId}/contacts/${id}`,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", userId, "contacts"],
      });
    },
  });

  return { deleteMutation };
};
