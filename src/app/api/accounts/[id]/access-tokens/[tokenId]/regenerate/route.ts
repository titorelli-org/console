import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares"
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
    const { user, accountId } = await accountAccessTokensSecurity(params)
    const tokenId = unmaskNumber(params.tokenId)

    if (tokenId == null)
      unauthorized()

    const securityService = getSecurityService()

    if (!await securityService.userCanRegenerateAccountToken(user.id, accountId))
      unauthorized()

    const accessTokensService = getAccessTokensService()

    const { token, id } = await accessTokensService.regenerate(tokenId)

    return { token, id: maskNumber(id) } as AccessTokenCreatedResultVm
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

//   const { token, id } = await accessTokensService.regenerate(tokenId)
//   const result: AccessTokenCreatedResultVm = { token, id: maskNumber(id) }

//   return NextResponse.json(result)
// }
