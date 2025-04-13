import slugify from "@sindresorhus/slugify";
import { prismaClient } from "../prisma-client";
import { BotState } from "@/types/bot";
import { createClient } from "@titorelli/client";
import { getAccessTokensService } from "./instances";
import { mapAsync } from "@/lib/utils";

export class BotService {
  private prisma = prismaClient;
  private titorelli = createClient({
    serviceUrl: process.env.TITORELLI_SERVICE_URL!,
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
    console.log("BotService#create()");

    console.log("modelId", modelId);
    console.log("accessTokenId", accessTokenId);

    if (modelId == null || accessTokenId == null) return null;

    const tgBotUser = await this.tgGetMe(tgBotToken);

    console.log("tgBotUser =", tgBotUser);

    if (!tgBotUser) return null;

    console.log(71);

    const maybeBot = await this.prisma.managedBot.findFirst({
      where: { tgBotToken },
    });

    console.log(77);

    if (maybeBot != null) {
      console.log("EXISTS!!!!");

      throw new Error("Bot with given token already exists");
    }

    console.log(85);

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

      console.log("id =", id);

      const accessToken = await this.accessTokensService.privateGetToken(
        accessTokenId,
        t,
      );

      console.log("accessToken =", accessToken);

      if (!accessToken) {
        console.log("Fail transaction");

        throw new Error(
          `Can\'t create bot because provided accessToken not exists by id = ${accessTokenId}`,
        );
      }

      console.log("request to titorelli");

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

      console.log("complete request to titorelli");

      console.groupEnd();

      return true;
    });
  }

  public async changeState(botId: number, newState: BotState) {
    const bot = await this.prisma.managedBot.findFirst({
      where: { id: botId },
    });

    if (!bot) return null;

    switch (newState) {
      case "created":
        return null; // Do nothing
      case "starting":
        return this.start(botId);
      case "running":
        return null; // Do nothing
      case "stopping":
        return this.stop(botId);
      case "stopped":
        return null; // Do nothig
      case "failed":
        return null; // Do nothing
      case 'deleted':
        return this.remove(botId)
      default:
        return null; // Do nothing
    }
  }

  public async remove(botId: number) {
    return await this.prisma.$transaction(async (t) => {
      await t.managedBot.delete({ where: { id: botId } });

      await this.titorelli.bots.remove(botId);
    });
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
