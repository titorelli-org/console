import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { UserContactVm } from "@/types/my-profile";

export const useGetOwnContacts = (userId: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["users", userId, "contacts"],
    async queryFn() {
      console.log("queryFn!!!");

      const { data } = await apiClient.get<UserContactVm[]>(
        `/api/users/${userId}/contacts`,
      );

      return data;
    },
  });
};
