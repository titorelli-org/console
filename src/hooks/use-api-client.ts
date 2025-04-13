import axios from "axios";
import { env } from "@/lib/server/env";
import { useSession } from "./use-session";
import { sessionTokenCookieName } from "@/constants";
import { OperationStatus } from "@/lib/server/OperationStatus";

const client = axios.create({ baseURL: env.SITE_ORIGIN ?? "/" });

client.interceptors.response.use((value) => {
  if (value.data != null && OperationStatus.matchShape(value.data)) {
    Promise.reject(OperationStatus.from(value.data).toError);
  }

  return value;
});

export const useApiClient = () => {
  const session = useSession();

  if (session) {
    client.defaults.headers.common["Cookie"] =
      `${sessionTokenCookieName}=${session}`;
  } else {
    delete client.defaults.headers.common["Cookie"];
  }

  return client;
};
