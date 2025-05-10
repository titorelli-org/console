import { type FC, type PropsWithChildren } from "react";
import { AccountProvider } from "@/components/account/AccountProvider";

const AccountLayout: FC<PropsWithChildren> = ({ children }) => {
  return <AccountProvider>{children}</AccountProvider>;
};

export default AccountLayout;
