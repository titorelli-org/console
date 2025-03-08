import { createContext, type FC, type ReactNode } from "react";

export const SessionContext = createContext<string | null>(null);

export const SessionProvider: FC<{
  session: string | null;
  children: ReactNode;
}> = ({ session, children }) => (
  <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
);
