import axios from "axios";
import { useSession } from "./use-session";
import { sessionTokenCookieName } from "@/constants";
import { OperationStatus } from "@/lib/server/OperationStatus";

const client = axios.create({ baseURL: process.env.SITE_ORIGIN ?? "/" });

client.interceptors.response.use((value) => {
  if (value.data != null && OperationStatus.matchShape(value.data)) {
    const operationStatus = OperationStatus.from(value.data);

    Promise.reject(operationStatus.toError());
  }

  return value;
});

export const useApiClient = () => {
  const session = useSession();

  if (typeof window === "undefined") {
    if (session) {
      client.defaults.headers.common["Cookie"] =
        `${sessionTokenCookieName}=${session}`;
    } else {
      delete client.defaults.headers.common["Cookie"];
    }
  }

  return client;
};
