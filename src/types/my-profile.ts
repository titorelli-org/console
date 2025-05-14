import { maskNumber } from "@/lib/server/keymask";
import type { UserContact } from "@prisma/client";

export type ProfileAccountRoles = "member" | "owner" | "invited";

export type ProfileAccountVm = {
  id: string;
  name: string;
  owner: {
    id: string;
    username: string;
  };
  role: ProfileAccountRoles;
};

export type UserContactVm = {
  id: string;
  type: string;
  value: string;
  status: "verified" | "unverified";
};

const getValueFromUserContact = ({ type, email, phone }: UserContact) => {
  if (type === "email") {
    return email;
  } else if (type === "phone") {
    return phone;
  }
};

const getStatusFromUserContact = ({
  type,
  emailConfirmed,
  phoneInvalid,
}: UserContact) => {
  if (type === "email") {
    return emailConfirmed ? "verified" : "unverified";
  } else if (type === "phone") {
    return phoneInvalid ? "unverified" : "verified";
  }
};

export const mapUserContactToVm = (uc: UserContact) => {
  const { id, type } = uc;

  return {
    id: maskNumber(id),
    type,
    value: getValueFromUserContact(uc),
    status: getStatusFromUserContact(uc),
  };
};
