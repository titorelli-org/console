import { unauthorized } from "next/navigation"
import { z } from "zod"
import { createZodRoute } from "next-zod-route"
import { maskNumber } from "@/lib/server/keymask"
import { getAccessTokensService, getSecurityService } from "@/lib/server/services/instances"
import { mapAccessTokenDtoToVm, type AccessTokenCreatedResultVm, type AccessTokenVm } from "@/types/access-tokens"
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares"

export const GET = createZodRoute()
  .params(z.object({
    id: z.string()
  }))
  .handler(async (_req, { params }) => {
    const { user, accountId } = await accountAccessTokensSecurity(params)

    const securityService = getSecurityService()

    if (!await securityService.userHasAccessToAccountTokens(user.id, accountId))
      unauthorized()

    const accessTokensService = getAccessTokensService()
    const accountTokens = await accessTokensService.listByAccountId(accountId)

    return accountTokens.map(mapAccessTokenDtoToVm) as AccessTokenVm[]
  })

export const POST = createZodRoute()
  .params(z.object({
    id: z.string()
  }))
  .body(z.object({
    name: z.string(),
    description: z.string()
  }))
  .handler(async (_req, { params, body: { name, description } }) => {
    const { user, accountId } = await accountAccessTokensSecurity(params)

    const securityService = getSecurityService()

    if (!await securityService.userCanCreateAccountToken(user.id, accountId))
      unauthorized()

    const accessTokensService = getAccessTokensService()

    const { token, id } = await accessTokensService.create(accountId, name, description)

    return { token, id: maskNumber(id) } as AccessTokenCreatedResultVm
  })
