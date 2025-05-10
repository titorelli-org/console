import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unmaskNumber } from "@/lib/server/keymask";
import { securityCheck } from "@/lib/server/security-check";
import {
  getBotService,
  getSecurityService,
} from "@/lib/server/services/instances";
import { mapBotDtoToVm } from "@/types/bot";
import { createZodRoute } from "next-zod-route";
import { unauthorized } from "next/navigation";
import { z } from "zod";

export const GET = createZodRoute()
  .params(
    z.object({
      id: z.string(),
    }),
  )
  .query(
    z.object({
      accessTokenId: z.string(),
    }),
  )
  .handler(
    async (
      _req,
      {
        params: { id: accountIdStr },
        query: { accessTokenId: accessTokenIdStr },
      },
    ) => {
      const securityService = getSecurityService();
      const accountId = unmaskNumber(accountIdStr);
      const accessTokenId = unmaskNumber(accessTokenIdStr);
      const user = await getUserInRoute();

      if (!accountId) unauthorized();

      if (!user) unauthorized();

      await securityCheck(
        securityService.userHasAccessToAccountBots,
        user.id,
        accountId,
      );

      const botService = getBotService();
      const bots = await botService.listAffectedBots(accountId, accessTokenId);

      return bots.map(mapBotDtoToVm);
    },
  );
