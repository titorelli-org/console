"use server";

import {
  LeaveFormState,
  LeaveIntents,
} from "@/components/my-profile/accounts-list/account-item/leave-button";
import { getUserInAction } from "@/lib/server/get-user-in-action";
import { unmaskNumber } from "@/lib/server/keymask";
import { securityCheck } from "@/lib/server/security-check";
import {
  getAccountService,
  getEmailService,
  getSecurityService,
} from "@/lib/server/services/instances";
import { unauthorized } from "next/navigation";

export const leaveAccount = async (
  prevState: LeaveFormState,
  form: FormData,
) => {
  const accountService = getAccountService();
  const emailService = getEmailService();

  const user = await getUserInAction();
  const intent = form.get("intent")?.toString() as LeaveIntents | undefined;
  const accountIdMasked = form.get("account_id")?.toString();
  const newOwnerIdMasked = form.get("new_owner_id")?.toString();
  const nextState: LeaveFormState = {
    success: null,
    errors: {},
  };

  if (!user) unauthorized();

  if (!accountIdMasked) {
    nextState.errors.account_id = "Номер аккаунта не указан";

    return nextState;
  }

  if (intent === "new_owner" && !newOwnerIdMasked) {
    nextState.errors.new_owner_id = "Получатель прав владельца не указан";

    return nextState;
  }

  const accountId = unmaskNumber(accountIdMasked);

  const securityService = getSecurityService();

  await securityCheck(securityService.userCanLeaveAccount, user.id, accountId);

  switch (intent) {
    case "wipe":
      const membersCount = await accountService.countAccountMembers(accountId);

      if (membersCount === 1 /* only owner */) {
        nextState.success = await accountService.deleteAccount(accountId);
      } else {
        nextState.success =
          await emailService.sendDeleteAccountConfirmationEmail(accountId);
      }

      break;
    case "new_owner":
      const newOwnerId = unmaskNumber(newOwnerIdMasked!);

      nextState.success = await accountService.transferOwnership(
        accountId,
        newOwnerId,
      );

      if (nextState.success) {
        nextState.success = await accountService.leaveAccount(
          accountId,
          user.id,
        );
      }

      break;
  }

  return nextState;
};
