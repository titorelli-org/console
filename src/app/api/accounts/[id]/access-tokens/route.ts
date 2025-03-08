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
    const accountTokens = await accessTokensService.list(accountId)

    return accountTokens.map(mapAccessTokenDtoToVm) as AccessTokenVm[]
  })

// export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
//   const { id: accountIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   // TODO: Check if account exist and user have access to it

//   const accessTokensService = getAccessTokensService()
//   const accountTokens = await accessTokensService.list(accountId)

//   const result: AccessTokenVm[] = accountTokens.map(mapAccessTokenDtoToVm)

//   return NextResponse.json(result)
// }

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

// export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
//   const { id: accountIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   // TODO: Check if account exist and user have access to it

//   const { name, description } = await req.json() as Awaited<AccessTokenCreatedRequestDataVm>

//   const accessTokensService = getAccessTokensService()

//   const { token, id } = await accessTokensService.create(accountId, name, description)
//   const result: AccessTokenCreatedResultVm = { token, id: maskNumber(id) }

//   return NextResponse.json(result)
// }
