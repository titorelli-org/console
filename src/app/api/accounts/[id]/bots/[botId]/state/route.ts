import { unmaskNumber } from "@/lib/server/keymask";
import { getBotService, getSecurityService } from "@/lib/server/services/instances";
import { BotState } from "@/types/bot";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unauthorized } from "next/navigation";
import { securityCheck } from "@/lib/server/security-check";

export const POST = createZodRoute()
  .params(z.object({
    id: z.string(),
    botId: z.string()
  }))
  .body(z.object({
    id: z.string(),
    state: z.string()
  }))
  .handler(async (_req, { params, body }) => {
    const accountId = unmaskNumber(params.id)
    const botId = unmaskNumber(params.botId)
    const user = await getUserInRoute()

    if (!accountId)
      unauthorized()

    if (!botId)
      unauthorized()

    if (!user)
      unauthorized()

    const securityService = getSecurityService()

    securityCheck(securityService.userCanChangeBotState, user.id, accountId)

    const botService = getBotService()
    await botService.changeState(botId, body.state as BotState)

    const newState = await botService.getBotState(botId)

    return { state: newState }
  })

// export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string, botId: string }> }) => {
//   const { id: accountIdStr, botId: botIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)
//   const botId = unmaskNumber(botIdStr)!

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   if (botId == null)
//     throw new Error('Bot id not provided')

//   // TODO: Check if bot exist and user have access to it

//   const { state } = await req.json() as Awaited<BotStateChangeRequestDataVm>

//   const botService = getBotService()
//   await botService.changeState(botId, state)

//   const newState = await botService.getBotState(botId)

//   return NextResponse.json({ state: newState })
// }
