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

// export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string, tokenId: string }> }) => {
//   const { id: accountIdStr, tokenId: tokenIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)
//   const tokenId = unmaskNumber(tokenIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   if (tokenId == null)
//     throw new Error('Token id not provieded')

//   // TODO: Check if account and token exists and user have access to them

//   const accessTokensService = getAccessTokensService()

//   await accessTokensService.revoke(tokenId)

//   return NextResponse.json({ ok: true })
// }
