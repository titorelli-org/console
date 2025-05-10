"use client";

import { extractAccountIdFromPathname } from "@/lib";
import { usePathname } from "next/navigation";
import { createContext, PropsWithChildren, type FC } from "react";

export const accountIdContext = createContext<string | null>(null);

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const accountId = extractAccountIdFromPathname(pathname);

  return (
    <accountIdContext.Provider value={accountId}>
      {children}
    </accountIdContext.Provider>
  );
};
