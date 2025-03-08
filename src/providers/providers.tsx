"use client";

import { type ReactNode, type FC } from "react";
import { QueryClientProvider } from "./query-client-provider";
import { SessionProvider } from "./session-provider";

export const Providers: FC<{ session: string | null; children: ReactNode }> = ({
  session,
  children,
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
