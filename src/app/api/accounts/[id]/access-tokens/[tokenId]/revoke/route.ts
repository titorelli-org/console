import { unauthorized } from "next/navigation";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { unmaskNumber } from "@/lib/server/keymask";
import { OperationStatus } from "@/lib/server/OperationStatus";
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares";
import {
  getAccessTokensService,
  getBotService,
  getSecurityService,
} from "@/lib/server/services/instances";
import { mapAsync } from "@/lib";

export const POST = createZodRoute()
  .params(
    z.object({
      id: z.string(),
      tokenId: z.string(),
    }),
  )
  .handler(async (_req, { params }) => {
    const { user, accountId } = await accountAccessTokensSecurity(params);
    const tokenId = unmaskNumber(params.tokenId);

    const securityService = getSecurityService();

    if (!(await securityService.userCanRevokeAccountToken(user.id, accountId)))
      unauthorized();

    const accessTokensService = getAccessTokensService();
    const botService = getBotService();

    try {
      await accessTokensService.revoke(tokenId);

      try {
        await mapAsync(
          await botService.listAffectedBots(accountId, tokenId),
          async (bot) => botService.changeState(bot.id, "stopping"),
        );
      } catch (e) {
        return OperationStatus.fail(e);
      }

      return OperationStatus.ok();
    } catch (e) {
      return OperationStatus.fail(e);
    }
  });
