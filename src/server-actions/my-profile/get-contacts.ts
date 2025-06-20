import { getUserInAction } from "@/lib/server/get-user-in-action";
import { securityCheck } from "@/lib/server/security-check";
import {
  getSecurityService,
  getUserService,
} from "@/lib/server/services/instances";
import { mapUserContactToVm } from "@/types/my-profile";
import { unauthorized } from "next/navigation";

export const getContacts = async () => {
  const user = await getUserInAction();

  if (!user) {
    unauthorized();
  }

  const securityService = getSecurityService();
  const userService = getUserService();

  await securityCheck(securityService.userHasAccessToContacts, user.id);

  const contacts = await userService.getContacts(user.id);

  return contacts.map(mapUserContactToVm);
};
