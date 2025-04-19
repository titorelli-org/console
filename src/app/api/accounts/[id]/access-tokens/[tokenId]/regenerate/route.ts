import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares"
import { securityCheck } from "@/lib/server/security-check"
import { getAccessTokensService, getSecurityService } from "@/lib/server/services/instances"
import type { AccessTokenCreatedResultVm } from "@/types/access-tokens"
import { createZodRoute } from "next-zod-route"
import { unauthorized } from "next/navigation"
import { z } from "zod"

export const POST = createZodRoute()
  .params(z.object({
    id: z.string(),
    tokenId: z.string()
  }))
  .handler(async (_req, { params }) => {
    const securityService = getSecurityService()
    const { user, accountId } = await accountAccessTokensSecurity(params)
    const tokenId = unmaskNumber(params.tokenId)

    if (tokenId == null)
      unauthorized()

    await securityCheck(securityService.userCanRegenerateAccountToken, user.id, accountId)

    const accessTokensService = getAccessTokensService()

    const { token, id } = await accessTokensService.regenerate(tokenId)

    return { token, id: maskNumber(id) } as AccessTokenCreatedResultVm
  })
