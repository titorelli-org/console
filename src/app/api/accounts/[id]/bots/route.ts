import { unmaskNumber } from "@/lib/server/keymask";
import { getBotService, getModelsService, getSecurityService } from "@/lib/server/services/instances";
import { mapBotDtoToVm } from "@/types/bot";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { unauthorized } from "next/navigation";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { securityCheck } from '@/lib/server/security-check'
import { OperationStatus } from "@/lib/server/OperationStatus";

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

    await securityCheck(securityService.userHasAccessToAccountBots, user.id, accountId)

    const botService = getBotService()
    const bots = await botService.list(accountId)

    return bots.map(mapBotDtoToVm) 
  })

// export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
//   const { id: accountIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   // TODO: Check if account exist and user have access to it

//   const botService = getBotService()
//   const bots = await botService.list(accountId)

//   const result = bots.map(mapBotDtoToVm)

//   return NextResponse.json(result)
// }

export const POST = createZodRoute()
  .params(z.object({
    id: z.string()
  }))
  .body(z.object({
    name: z.string(),
    description: z.string(),
    bypassTelemetry: z.boolean(),
    modelCode: z.string(),
    accessTokenId: z.string(),
    tgBotToken: z.string()
  }))
  .handler(async (_req, { params, body: data }) => {
    const accountId = unmaskNumber(params.id)
    const user = await getUserInRoute()

    if (accountId == null)
      unauthorized()

    if (!user)
      unauthorized()

    const securityService = getSecurityService()

    await securityCheck(securityService.userCanCreateBot, user.id, accountId)

    const botService = getBotService()
    const modelsService = getModelsService()

    await botService.create(accountId, {
      name: data.name,
      description: data.description,
      bypassTelemetry: data.bypassTelemetry,
      modelId: await modelsService.getModelIdByCode(accountId, data.modelCode),
      accessTokenId: unmaskNumber(data.accessTokenId),
      tgBotToken: data.tgBotToken
    })

    return new OperationStatus(true)
  })

// export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
//   const { id: accountIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   const data = await req.json() as Awaited<BotCreateRequestDataVm>

//   // TODO: Check if account exist and user have access to it

//   const botService = getBotService()
//   const modelsService = getModelsService()

//   await botService.create(accountId, {
//     name: data.name,
//     description: data.description,
//     bypassTelemetry: data.bypassTelemetry,
//     modelId: await modelsService.getModelIdByCode(accountId, data.modelCode),
//     accessTokenId: unmaskNumber(data.accessTokenId),
//     tgBotToken: data.tgBotToken
//   })

//   return NextResponse.json({ ok: true })
// }
