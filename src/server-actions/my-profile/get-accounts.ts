'use server'

import { getUserInAction } from "@/lib/server/get-user-in-action"
import { maskNumber } from "@/lib/server/keymask"
import { getAccountService, getSecurityService } from "@/lib/server/services/instances"
import { mapFilterAsync } from "@/lib/utils"
import { ProfileAccountVm } from "@/types/my-profile"
import { AccountMember, User } from "@prisma/client"
import { unauthorized } from "next/navigation"

const getOwnerFromMembers = (members: (AccountMember & { user: User | null })[]) =>
  members.find(({ role }) => role === 'owner')

export const getAccounts = async () => {
  const user = await getUserInAction()

  if (!user) {
    unauthorized()
  }

  const accountService = getAccountService()
  const securityService = getSecurityService()

  const accounts = await accountService.getAccountsUserMemberOf(user.id)

  return mapFilterAsync(accounts, async ({ id, name, members }) => {
    const owner = getOwnerFromMembers(members)
    const role = await accountService.getUserRoleInAccount(user.id, id)
    const accessCheck = await securityService.userHasAccessToAccount(user.id, id)

    switch (true) {
      case !accessCheck:
      case !owner:
      case !role:
      case owner?.user == null:
        return null
    }

    return {
      id: maskNumber(id),
      name,
      owner: {
        id: maskNumber(owner.user.id),
        username: owner.user.username
      },
      role
    } as ProfileAccountVm
  })
}
