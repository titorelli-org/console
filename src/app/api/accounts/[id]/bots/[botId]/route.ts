import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unmaskNumber } from "@/lib/server/keymask";
import { OperationStatus } from "@/lib/server/OperationStatus";
import { securityCheck } from "@/lib/server/security-check";
import {
  getSecurityService,
  getBotService,
} from "@/lib/server/services/instances";
import { createZodRoute } from "next-zod-route";
import { unauthorized } from "next/navigation";
import { z } from "zod";

export const DELETE = createZodRoute()
  .params(
    z.object({
      id: z.string(),
      botId: z.string(),
    }),
  )
  .handler(async (_req, { params }) => {
    const accountId = unmaskNumber(params.id);
    const botId = unmaskNumber(params.botId);
    const user = await getUserInRoute();

    if (!accountId) unauthorized();

    if (!botId) unauthorized();

    if (!user) unauthorized();

    const securityService = getSecurityService();

    await securityCheck(securityService.userCanRemoveBot, user.id, accountId);

    const botService = getBotService();

    await botService.remove(botId);

    return OperationStatus.ok();
  });
