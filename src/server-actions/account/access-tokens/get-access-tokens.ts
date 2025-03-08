import { getUserInAction } from "@/lib/server/get-user-in-action"
import { unmaskNumber } from "@/lib/server/keymask"
import { securityCheck } from "@/lib/server/security-check"
import { getAccessTokensService, getSecurityService } from "@/lib/server/services/instances"
import { AccessTokenVm, mapAccessTokenDtoToVm } from "@/types/access-tokens"
import { unauthorized } from "next/navigation"

/**
 * @deprecated
 * Используется в качестве `initialData` для `useSuspenseQuery`, что кажется избыточным
 */
export const getAccessTokens = async (accountIdStr: string) => {
  const accountId = unmaskNumber(accountIdStr)
  const user = await getUserInAction()

  if (!accountId)
    unauthorized()

  if (!user)
    unauthorized()

  const securityService = getSecurityService()

  await securityCheck(securityService.userHasAccessToAccountTokens, user.id, accountId)

  const accessTokensService = getAccessTokensService()
  const accountTokens = await accessTokensService.list(accountId)

  const result: AccessTokenVm[] = accountTokens.map(mapAccessTokenDtoToVm)

  return result
}
