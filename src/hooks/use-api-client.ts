import { inspect } from "node:util";
import axios from "axios";
import { env } from "@/lib/server/env";
import { useSession } from "./use-session";
import { sessionTokenCookieName } from "@/constants";

const client = axios.create({ baseURL: env.SITE_ORIGIN ?? "/" });

client.interceptors.response.use(
  (value) => value,
  (error) => {
    console.group("AXIOS RESPONSE ERROR");
    console.error(inspect(error, false, null));
    console.groupEnd();

    return Promise.reject(error);
  },
);

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
