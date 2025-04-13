import { z } from "zod";
import { createZodRoute } from "next-zod-route";
import { unmaskNumber } from "@/lib/server/keymask";
import {
  getBotService,
  getSecurityService,
} from "@/lib/server/services/instances";
import type { BotState } from "@/types/bot";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unauthorized } from "next/navigation";
import { securityCheck } from "@/lib/server/security-check";

export const POST = createZodRoute()
  .params(
    z.object({
      id: z.string(),
      botId: z.string(),
    }),
  )
  .body(
    z.object({
      state: z.string(),
    }),
  )
  .handler(async (_req, { params, body }) => {
    const securityService = getSecurityService();
    const botService = getBotService();
    const accountId = unmaskNumber(params.id);
    const botId = unmaskNumber(params.botId);
    const user = await getUserInRoute();

    if (!accountId) unauthorized();

    if (!botId) unauthorized();

    if (!user) unauthorized();

    await securityCheck(
      securityService.userCanChangeBotState,
      user.id,
      accountId,
    );

    await botService.changeState(botId, body.state as BotState);

    const newState = await botService.getBotState(botId);

    return { state: newState };
  });
