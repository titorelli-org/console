import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { Prediction } from "@titorelli/client";

export const useDemoClassify = () => {
  const apiClient = useApiClient();

  return useMutation({
    async mutationFn({ text }: { text: string }) {
      const { data } = await apiClient.post<Prediction>("/api/demo-classify", {
        text,
      });

      return data;
    },
  });
};
