import { unauthorized } from "next/navigation"
import { getUserInRoute } from "./get-user-in-route"
import { unmaskNumber } from "./keymask"
import { getAccountService } from "./services/instances"

export const accountAccessTokensSecurity = async (params: { id: string }) => {
  const user = await getUserInRoute()

  if (!user)
    unauthorized()

  const accountId = unmaskNumber(params.id)

  if (accountId == null)
    unauthorized()

  const accountService = getAccountService()

  if (!await accountService.accountExist(accountId))
    unauthorized()

  return { user, accountId }
}
