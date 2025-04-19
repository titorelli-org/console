import { unauthorized } from "next/navigation"
import { createZodRoute } from "next-zod-route"
import { z } from "zod"
import { unmaskNumber } from "@/lib/server/keymask"
import { OperationStatus } from "@/lib/server/OperationStatus"
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares"
import { getAccessTokensService, getSecurityService } from "@/lib/server/services/instances"

export const POST = createZodRoute()
  .params(z.object({
    id: z.string(),
    tokenId: z.string()
  }))
  .handler(async (_req, { params }) => {
    const { user, accountId } = await accountAccessTokensSecurity(params)
    const tokenId = unmaskNumber(params.tokenId)

    const securityService = getSecurityService()

    if (!await securityService.userCanRevokeAccountToken(user.id, accountId))
      unauthorized()

    const accessTokensService = getAccessTokensService()

    await accessTokensService.revoke(tokenId)

    return new OperationStatus(true)
  })
