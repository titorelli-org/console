import Generator from "do-usernames";
import toKebab from "kebab-case";
import { ProfileAccountRoles } from "@/types/my-profile";
import { mapFilter, mapFilterAsync } from "@/lib/utils";
import {
  getInviteService,
  getModelsService,
  getUserService,
} from "./instances";
import { prismaClient } from "../prisma-client";
import { addHours } from "date-fns";
import { first, forEach, groupBy, property } from "lodash";

export class AccountService {
  /**
   * `usernameGenerator` генерирует имена по Digital Ocean-овски,
   * т.е. на морскую тематику.
   * А надо генерировать на какую-то другую тематику, но с
   * таким же принципом
   */
  private usernameGenerator = new Generator();
  private prisma = prismaClient;
  private inviteValidityPeriodInHours = 72;

  get userService() {
    return getUserService();
  }

  get inviteService() {
    return getInviteService();
  }

  get modelsService() {
    return getModelsService();
  }

  async getAccount(accountId: number) {
    return this.prisma.account.findFirst({
      where: { id: accountId },
    });
  }

  public async accountExist(accountId: number) {
    const accountsCount = await this.prisma.account.count({
      where: { id: accountId },
    });

    return accountsCount >= 1;
  }

  /**
   * @todo
   * Нужно понять, что происходит и что делать,
   * когда не удалось сгенерировать имя с `attemptLeft`
   * попыток. Вероятно, это означает, что все имена уже заняты
   * Но, поскольку аккаунт идентифицируется только с помощью имени,
   * это важно, чтобы все они были уникальными
   * Задача на подумать
   */
  public async createDefaultAccountForUser(userId: number) {
    let name: string;
    let attemptLeft = 10;

    do {
      attemptLeft -= 1;

      name = this.generateAccountName();

      if (!attemptLeft) throw new Error("Account name generation hangs");
    } while (await this.getIsAccountNameTaken(name));

    return this.createAccountWithSingleOwner(userId, name);
  }

  /**
   * @todo
   * Обработать сценарий, когда название аккаунта занято
   */
  public async createAccountWithNameForUser(userId: number, name: string) {
    if (await this.getIsAccountNameTaken(name)) {
      throw new Error(`Account name = "${name}" taken`);
    }

    return this.createAccountWithSingleOwner(userId, name);
  }

  public async createAccountAndInviteMembers(
    ownerUserId: number,
    accountName: string,
    members: { identity: string; role: string }[],
  ) {
    if (await this.getIsAccountNameTaken(accountName)) {
      throw new Error(`Account nam
        e = "${name}" taken`);
    }

    const [createdInvites, account] = await this.prisma.$transaction(
      async (t) => {
        const account = await t.account.create({
          data: {
            name: accountName,
          },
        });

        await t.accountMember.create({
          data: {
            role: "owner",
            accountId: account.id,
            userId: ownerUserId,
          },
        });

        const inviteInputs = await mapFilterAsync(
          members,
          async ({ identity, role: _role /** always "member" */ }) => {
            const identityType = this.userService.getIdentityType(identity);

            if (!identityType) return null;

            const user = await this.userService.getUserByIdentnty(identity);

            if (user?.id === ownerUserId) return null;

            return {
              role: "member",
              userId: user?.id ?? undefined,
              identityType,
              email: identityType === "email" ? identity : undefined,
              phone: identityType === "phone" ? identity : undefined,
              username: identityType === "username" ? identity : undefined,
              accountId: account.id,
              expiredAt: addHours(new Date(), this.inviteValidityPeriodInHours),
            };
          },
        );

        const uniqueByUserIdInviteInputs: typeof inviteInputs = [];

        forEach(groupBy(inviteInputs, "userId"), (invites, userIdStr) => {
          if (userIdStr === "undefined") {
            uniqueByUserIdInviteInputs.push(...invites);
          } else {
            uniqueByUserIdInviteInputs.push(first(invites)!);
          }
        });

        const createdInvites = await t.accountInvite.createManyAndReturn({
          data: uniqueByUserIdInviteInputs,
        });

        return [createdInvites, account];
      },
    );

    await this.modelsService.initGenericModel(account.id);

    await this.inviteService.sendInvites(createdInvites);
  }

  /**
   * @todo Излишний запрос, подумать как избавиться
   */
  public async getUserRoleInAccount(userId: number, accountId: number) {
    const membership = await this.prisma.accountMember.findFirst({
      where: {
        userId,
        accountId,
      },
    });

    return (membership?.role as ProfileAccountRoles | undefined) ?? null;
  }

  /**
   * @todo
   * Rewrite to query `accountMember`
   */
  public async getAccountsUserMemberOf(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        accountMembership: {
          include: {
            account: {
              include: {
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const accounts = user?.accountMembership.map(({ account }) => account);

    return accounts ?? [];
  }

  public async getAccountUserMemberOf(userId: number, accountId: number) {
    const accountMember = await this.prisma.accountMember.findFirst({
      where: { userId, accountId },
      include: {
        account: true,
      },
    });

    return accountMember?.account ?? null;
  }

  public async countAccountsUserMemberOf(userId: number) {
    return this.prisma.accountMember.count({
      where: { userId },
    });
  }

  public async gitAccountMembersWhichNotInvited(accountId: number) {
    const memberships = await this.prisma.accountMember.findMany({
      where: {
        accountId,
        role: { not: "invited" },
      },
      include: {
        user: true,
      },
    });

    return mapFilter(memberships, property("user"));
  }

  public async countAccountMembers(accountId: number) {
    return this.prisma.accountMember.count({
      where: { accountId },
    });
  }

  /**
   * @todo Добавить удаление других объектов
   */
  public async deleteAccount(accountId: number) {
    await this.prisma.$transaction(async (t) => {
      await t.accessToken.deleteMany({
        where: {
          accountId,
        },
      });

      await t.classificationModel.deleteMany({
        where: {
          accountId,
        },
      });

      await t.managedBot.deleteMany({
        where: {
          accountId,
        },
      });

      await t.accountMember.deleteMany({
        where: {
          accountId,
        },
      });

      await t.accountInvite.deleteMany({
        where: {
          accountId,
        },
      });

      await t.account.delete({
        where: {
          id: accountId,
        },
      });
    });

    return true;
  }

  public async transferOwnership(accountId: number, newOwnerId: number) {
    return this.prisma.$transaction(async (t) => {
      const newOwnerMember = await t.accountMember.findFirst({
        where: { accountId, userId: newOwnerId },
      });
      const oldOwnerMember = await t.accountMember.findFirst({
        where: { accountId, role: "owner" },
      });

      if (!newOwnerMember || !oldOwnerMember) return false;

      await t.accountMember.update({
        where: { id: newOwnerMember.id },
        data: { role: "owner" },
      });

      await t.accountMember.update({
        where: { id: oldOwnerMember.id },
        data: { role: "member" },
      });

      return true;
    });
  }

  public async leaveAccount(accountId: number, userId: number) {
    await this.prisma.accountMember.deleteMany({
      where: { accountId, userId },
    });

    return true;
  }

  public async getIsAccountNameTaken(name: string) {
    const count = await this.prisma.account.count({
      where: {
        name,
      },
    });

    return count > 0;
  }

  private generateAccountName() {
    return toKebab(this.usernameGenerator.getName(), false)!;
  }

  private async createAccountWithSingleOwner(userId: number, name: string) {
    const accountId = await this.prisma.$transaction(async (t) => {
      const account = await t.account.create({
        data: {
          name,
        },
      });

      await t.accountMember.create({
        data: {
          role: "owner",
          accountId: account.id,
          userId,
        },
      });

      return account.id;
    });

    await this.modelsService.initGenericModel(accountId);

    return accountId;
  }
}
