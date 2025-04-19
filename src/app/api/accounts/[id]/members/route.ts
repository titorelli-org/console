import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import type { SelectorAccountMemberVm } from "@/types/account-members-selector";
import { getAccountService, getSecurityService } from "@/lib/server/services/instances";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { unauthorized } from "next/navigation";
import { securityCheck } from "@/lib/server/security-check";
import { getUserInRoute } from "@/lib/server/get-user-in-route";

export const GET = createZodRoute()
  .params(z.object({
    id: z.string()
  }))
  .handler(async (_req, { params }) => {
  const accountId = unmaskNumber(params.id)
  const user = await getUserInRoute()

  if (!accountId)
    unauthorized()

  if (!user)
    unauthorized()

  const securityService = getSecurityService()

  await securityCheck(securityService.userHasAccessToAccountMembers, user.id, accountId)

  const accountService = getAccountService()
  const members = await accountService.getAccountMembers(accountId)

  return members.map(({ id, username }) => ({ id: maskNumber(id), username } as SelectorAccountMemberVm))
  })
