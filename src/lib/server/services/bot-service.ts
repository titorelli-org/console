import slugify from "@sindresorhus/slugify";
import { prismaClient } from "../prisma-client";
import { BotState } from "@/types/bot";
import { createClient } from "@titorelli/client";
import { getAccessTokensService } from "./instances";
import { mapAsync, mapFilterAsync } from "@/lib/utils";
import { ManagedBot } from "@prisma/client";

export class BotService {
  private prisma = prismaClient;
  private titorelli = createClient({
    serviceUrl: process.env.TITORELLI_SERVICE_URL!,
    casUrl: "--not-in-use--",
    clientId: "console",
    clientSecret: process.env.TITORELLI_CLIENT_SECRET!,
    scope: [
      "bots/create",
      "bots/list",
      "bots/update",
      "bots/read",
      "bots/remove",
    ],
    modelId: "generic",
  });

  private get accessTokensService() {
    return getAccessTokensService();
  }

  public async list(accountId: number) {
    const bots = await this.prisma.managedBot.findMany({
      where: { accountId },
    });

    return mapAsync(bots, async (bot) => {
      return Object.assign(bot, {
        state: await this.getBotState(bot.id),
      });
    });
  }

  public async create(
    accountId: number,
    {
      name,
      description,
      bypassTelemetry,
      modelId,
      accessTokenId,
      tgBotToken,
    }: {
      name: string;
      description: string;
      bypassTelemetry: boolean;
      modelId: number | null;
      accessTokenId: number | null;
      tgBotToken: string;
    },
  ) {
    if (modelId == null || accessTokenId == null)
      throw new Error("modelId or accessTokenId not provided");

    const tgBotUser = await this.tgGetMe(tgBotToken);

    if (!tgBotUser) throw new Error("Cannot get bot info (via getMe)");

    const maybeBot = await this.prisma.managedBot.findFirst({
      where: { tgBotToken },
    });

    if (maybeBot != null) {
      throw new Error("Bot with given token already exists");
    }

    return this.prisma.$transaction(async (t) => {
      const { id } = await t.managedBot.create({
        data: {
          name,
          code: slugify(name),
          description,
          bypassTelemetry,
          accountId,
          accessTokenId,
          modelId,
        },
      });

      const accessToken = await this.accessTokensService.privateGetToken(
        accessTokenId,
        t,
      );

      if (!accessToken) {
        throw new Error(
          `Can\'t create bot because provided accessToken not exists by id = ${accessTokenId}`,
        );
      }

      await this.titorelli.bots.create({
        id,
        accessToken,
        bypassTelemetry,
        accountId,
        modelId,
        tgBotToken,
        scopes:
          "generic/predict generic/train generic/exact_match/train generic/totems/train cas/predict cas/train",
      });

      return id;
    });
  }

  public async update({
    id,
    modelCode: _modelCode, // omiting this param because it's not supported now
    ...restParams
  }: {
    id: number;
    name?: string;
    description?: string;
    bypassTelemetry?: boolean;
    modelCode?: string;
    accessTokenId?: number;
  }) {
    await this.prisma.$transaction(async (t) => {
      await t.managedBot.update({
        where: { id },
        data: Object.fromEntries(
          Object.entries(restParams).filter(([_, v]) => v != undefined),
        ),
      });

      if (restParams.accessTokenId != null) {
        const newAccesstoken = await this.accessTokensService.privateGetToken(
          restParams.accessTokenId,
        );

        if (!newAccesstoken) throw new Error("New accessToken not exists");

        await this.titorelli.bots.update(id, {
          accessToken: newAccesstoken,
        });
      }
    });
  }

  public async changeState(botId: number, newState: BotState) {
    const bot = await this.prisma.managedBot.findFirst({
      where: { id: botId },
    });

    if (!bot) return null;

    switch (newState) {
      case "starting":
        return this.start(botId);
      case "stopping":
        return this.stop(botId);
      case "deleted":
        return this.remove(botId);
      default:
        return null; // Do nothing
    }
  }

  public async listAffectedBots(
    paramsAccountId: number,
    accessTokenId: number,
  ) {
    const accessToken =
      await this.accessTokensService.privateGetToken(accessTokenId);

    if (!accessToken) {
      return [];
    }

    const externalBots = (await this.titorelli.bots.list(paramsAccountId, {
      accessToken,
    })) as Awaited<{ id: number; accountId: number }[]>;

    return mapFilterAsync(externalBots, async ({ id, accountId }) => {
      if (accountId != paramsAccountId) {
        return null;
      }

      const bot = await this.prisma.managedBot.findFirst({
        where: { id, accountId },
      });

      if (!bot) {
        return null;
      }

      return Object.assign(bot, {
        state: await this.getBotState(bot.id),
      });
    });
  }

  public async remove(botId: number) {
    return await this.prisma.$transaction(async (t) => {
      await this.titorelli.bots.remove(botId);

      await t.managedBot.delete({ where: { id: botId } });
    });
  }

  public async restartBotsWithNewToken(bots: ManagedBot[], token: string) {
    return mapAsync(bots, async (bot) =>
      this.titorelli.bots.update(bot.id, { accessToken: token }),
    );
  }

  public async getBotState(botId: number) {
    return (await this.titorelli.bots.getState(botId)) as Awaited<BotState>;
  }

  private async start(botId: number) {
    return this.titorelli.bots.update(botId, { state: "starting" });
  }

  private async stop(botId: number) {
    return this.titorelli.bots.update(botId, { state: "stopping" });
  }

  private async tgGetMe(botToken: string) {
    try {
      const resp = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const userData = (await resp.json()) as
        | { ok: false }
        | {
            ok: true;
            result: {
              can_join_groups: boolean;
              can_read_all_group_messages: boolean;
              first_name: string;
              id: number;
              username: string;
              supports_inline_queries: boolean;
            };
          };

      if (userData.ok) {
        return {
          canJoinGroups: userData.result.can_join_groups,
          canReadAllGroupMessages: userData.result.can_read_all_group_messages,
          firstName: userData.result.first_name,
          id: userData.result.id,
          username: userData.result.username,
          supportsInlineQueries: userData.result.supports_inline_queries,
        };
      }

      return null;
    } catch (_e) {
      console.warn(_e);

      return null;
    }
  }
}
