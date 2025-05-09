import { unauthorized } from "next/navigation";
import { z } from "zod";
import { createZodRoute } from "next-zod-route";
import { unmaskNumber } from "@/lib/server/keymask";
import {
  getBotService,
  getModelsService,
  getSecurityService,
} from "@/lib/server/services/instances";
import { mapBotDtoToVm } from "@/types/bot";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { securityCheck } from "@/lib/server/security-check";
import { OperationStatus } from "@/lib/server/OperationStatus";

export const GET = createZodRoute()
  .params(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async (_req, { params }) => {
    const securityService = getSecurityService();
    const accountId = unmaskNumber(params.id);
    const user = await getUserInRoute();

    if (!accountId) unauthorized();

    if (!user) unauthorized();

    await securityCheck(
      securityService.userHasAccessToAccountBots,
      user.id,
      accountId,
    );

    const botService = getBotService();
    const bots = await botService.list(accountId);

    return bots.map(mapBotDtoToVm);
  });

export const POST = createZodRoute()
  .params(
    z.object({
      id: z.string(),
    }),
  )
  .body(
    z.object({
      name: z.string(),
      description: z.string(),
      bypassTelemetry: z.boolean(),
      startImmediately: z.boolean(),
      modelCode: z.string(),
      accessTokenId: z.string(),
      tgBotToken: z.string(),
    }),
  )
  .handler(async (_req, { params, body: data }) => {
    const botService = getBotService();
    const modelsService = getModelsService();
    const securityService = getSecurityService();
    const accountId = unmaskNumber(params.id);
    const user = await getUserInRoute();

    if (accountId == null) unauthorized();

    if (!user) unauthorized();

    await securityCheck(securityService.userCanCreateBot, user.id, accountId);

    try {
      const id = await botService.create(accountId, {
        name: data.name,
        description: data.description,
        bypassTelemetry: data.bypassTelemetry,
        modelId: await modelsService.getModelIdByCode(
          accountId,
          data.modelCode,
        ),
        accessTokenId: unmaskNumber(data.accessTokenId),
        tgBotToken: data.tgBotToken,
      });

      try {
        await botService.changeState(id, "starting");
      } catch (e) {
        return OperationStatus.fail(e);
      }

      return OperationStatus.ok();
    } catch (e) {
      return OperationStatus.fail(e);
    }
  });
