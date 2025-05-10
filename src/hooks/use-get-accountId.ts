import { useContext } from "react";
import { accountIdContext } from "@/components/account/AccountProvider";

export const useGetAccountId = () => {
  const accountId = useContext(accountIdContext);

  return accountId;
};
