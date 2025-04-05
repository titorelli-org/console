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
    console.group("create()");

    console.log("modelId", modelId);
    console.log("accessTokenId", accessTokenId);

    if (modelId == null || accessTokenId == null) return null;

    const user = await this.tgGetMe(tgBotToken);

    console.log("user =", user);

    if (!user) return null;

    const maybeBot = await this.prisma.managedBot.findFirst({
      where: { tgBotToken },
    });

    if (maybeBot != null) {
      console.log("EXISTS!!!!");

      throw new Error("Bot with given token already exists");
    }

    return await this.prisma.$transaction(async (t) => {
      const { id } = await t.managedBot.create({
        data: {
          name,
          code: slugify(name),
          description,
          bypassTelemetry,
          scopes:
            "generic/predict generic/train generic/exact_match/train generic/totems/train cas/predict cas/train", // TODO: Remove
          state: "created", // TODO: Remove
          accountId,
          accessTokenId, // TODO: Remove
          modelId,
          tgUsername: user.username,
          tgFirstName: user.firstName,
          tgLastName: "",
          tgUserId: user.id,
          canJoinGroups: user.canJoinGroups, // TODO: Remove
          canReadAllGroupMessages: user.canReadAllGroupMessages, // TODO: Remove
          supportsInlineQueries: user.supportsInlineQueries, // TODO: Remove
          tgBotToken, // TODO: Remove
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

    if (["created", "starting", "stopping", "failed"].includes(newState))
      return null;

    switch (`${bot.state}/${newState}`) {
      case "starting/stopped":
        return this.abort(botId);
      case "created/running":
        return this.start(botId);
      case "stopped/running":
        return this.start(botId);
      case "failed/running":
        return this.restart(botId);
      case "running/stopped":
        return this.stop(botId);
      default:
        return null;
    }
  }

  public async remove(botId: number) {
    return await this.prisma.$transaction(async (t) => {
      await t.managedBot.delete({ where: { id: botId } });

      await this.titorelli.bots.remove(botId);
    });
  }

  public async getBotState(botId: number) {
    console.log(
      "requestedScopes =",
      Reflect.get(this.titorelli, "requestedScopes"),
    );
    console.log(
      "grantedScopes =",
      Reflect.get(this.titorelli, "grantedScopes"),
    );

    return (await this.titorelli.bots.getState(botId)) as Awaited<BotState>;

    // const bot = await this.prisma.managedBot.findFirst({
    //   where: { id: botId },
    // });

    // return (bot?.state as BotState | undefined) ?? null;
  }

  private async start(botId: number) {
    return this.titorelli.bots.update(botId, { state: "starting" });

    // await this.prisma.managedBot.update({
    //   where: { id: botId },
    //   data: { state: "starting" },
    // });
  }

  private async stop(botId: number) {
    return this.titorelli.bots.update(botId, { state: "stopping" });

    // await this.prisma.managedBot.update({
    //   where: { id: botId },
    //   data: { state: "stopping" },
    // });
  }

  private async abort(botId: number) {
    return this.titorelli.bots.update(botId, { state: "stopping" });

    // await this.prisma.managedBot.update({
    //   where: { id: botId },
    //   data: { state: "stopping" },
    // });
  }

  private async restart(botId: number) {
    return this.titorelli.bots.update(botId, { state: "starting" });

    // await this.prisma.managedBot.update({
    //   where: { id: botId },
    //   data: { state: "starting" },
    // });
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
