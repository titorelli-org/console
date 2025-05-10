import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import { OperationStatus } from "@/lib/server/OperationStatus";
import { accountAccessTokensSecurity } from "@/lib/server/route-middlewares";
import { securityCheck } from "@/lib/server/security-check";
import {
  getAccessTokensService,
  getBotService,
  getSecurityService,
} from "@/lib/server/services/instances";
import type { AccessTokenCreatedResultVm } from "@/types/access-tokens";
import { createZodRoute } from "next-zod-route";
import { unauthorized } from "next/navigation";
import { z } from "zod";

export const POST = createZodRoute()
  .params(
    z.object({
      id: z.string(),
      tokenId: z.string(),
    }),
  )
  .handler(async (_req, { params }) => {
    const securityService = getSecurityService();
    const { user, accountId } = await accountAccessTokensSecurity(params);
    const tokenId = unmaskNumber(params.tokenId);

    if (tokenId == null) unauthorized();

    await securityCheck(
      securityService.userCanRegenerateAccountToken,
      user.id,
      accountId,
    );

    const accessTokensService = getAccessTokensService();
    const botService = getBotService();

    try {
      const { token, id } = await accessTokensService.regenerate(tokenId);

      try {
        await botService.restartWithNewToken(id, token);
      } catch (e) {
        return OperationStatus.fail(e);
      }

      return { token, id: maskNumber(id) } as AccessTokenCreatedResultVm;
    } catch (e) {
      return OperationStatus.fail(e);
    }
  });
