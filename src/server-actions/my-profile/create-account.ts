"use server";

import { AddAccountFormValues } from "@/components/my-profile/create-account-btn";
import { formDataToObject } from "@/lib/helpers/form-data";
import { getUserInAction } from "@/lib/server/get-user-in-action";
import { securityCheck } from "@/lib/server/security-check";
import {
  getAccountService,
  getSecurityService,
} from "@/lib/server/services/instances";
import { createArrayWithSingleValue } from "@/lib/utils";
import { unauthorized } from "next/navigation";

export type CreateAccountActionResult = {
  success: boolean;
  errors: {
    root?: string;
    accountName?: string;
    members?: (
      | {
          identity?: string;
          role?: string;
        }
      | undefined
    )[];
  };
};

/**
 * @todo
 * 0. Validate and normalize phone numbers, emails and usernames
 * 1. Deduplicate members by user id ✅
 * 2. Send invites to unregistered members ✅
 * 3. Send invites to registered members ✅
 * 4. If one of identity is a registered user and another
 *    is same user, but unregistered, what to do?
 *    It manifests itself when user receives invite
 *      and then logs in
 *      Need to stitch this user with given contact
 *        Should such contact be validated?
 *    Need some kind of user stitching
 */
export async function createAccount(
  form: FormData,
): Promise<CreateAccountActionResult> {
  const accountService = getAccountService();
  const user = await getUserInAction();
  const { accountName, members } = formDataToObject<AddAccountFormValues>(form);

  if (!user) unauthorized();

  const securityService = getSecurityService();

  await securityCheck(securityService.userCanCreateAccount, user.id);

  if (!accountName) {
    return {
      success: false,
      errors: { accountName: "Название аккаунта не заполнено" },
    };
  }

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    if (!member.identity) {
      return {
        success: false,
        errors: {
          members: createArrayWithSingleValue(
            { identity: "Идентификатор участника обязателен" },
            i,
          ),
        },
      };
    }

    if (!["member"].includes(member.role)) {
      return {
        success: false,
        errors: {
          members: createArrayWithSingleValue(
            { role: "Роль участника не указана" },
            i,
          ),
        },
      };
    }
  }

  if (await accountService.accountNameTaken(accountName)) {
    return {
      success: false,
      errors: { accountName: "Имя аккаунта занято. Впишите другое имя" },
    };
  }

  // TODO:
  // Clean members list:
  // 1. Clear duplicate values
  // 1.2. Phones must be normalized
  // 1.3. Emails should be normalized
  // 1.4. Usernames should be trimmed
  // 2. If raw value duplicates with different roles, raise error
  // 2.1. If multiple identities points to same user,
  //      send only one invite to this user

  try {
    await accountService.createAccountAndInviteMembers(
      user.id,
      accountName,
      members,
    );
  } catch (_e) {
    const e = _e as Error | null;

    if (e != null) {
      if (/Account name taken/.test(e.message)) {
        return {
          success: false,
          errors: { accountName: "Название аккаута занято" },
        };
      }

      console.error(e);
    }

    return {
      success: false,
      errors: { root: "Не удалось создать аккаунт. Попробуйте позже" },
    };
  }

  return { success: true, errors: {} };
}
