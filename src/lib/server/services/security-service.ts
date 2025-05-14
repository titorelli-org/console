import { prismaClient } from "../prisma-client";

export class SecurityService {
  private prisma = prismaClient;

  // #region users
  public async userHasAccessToContacts(_userId: number) {
    return true;
  }

  public async userCanDeleteContact(userId: number, _contactId: number) {
    return this.userHasAccessToContacts(userId);
  }
  // #endregion

  // #region account
  public async userHasAccessToAccount(userId: number, accountId: number) {
    const count = await this.prisma.accountMember.count({
      where: {
        userId,
        accountId,
      },
    });

    return count >= 1;
  }

  public async userCanCreateAccount(_userId: number) {
    return true;
  }

  // #region account tokens
  public async userHasAccessToAccountTokens(userId: number, accountId: number) {
    return this.userHasAccessToAccount(userId, accountId);
  }

  public async userCanCreateAccountToken(userId: number, accountId: number) {
    return this.userHasAccessToAccountTokens(userId, accountId);
  }

  public async userCanRegenerateAccountToken(
    userId: number,
    accountId: number,
  ) {
    return this.userHasAccessToAccountTokens(userId, accountId);
  }

  public async userCanRevokeAccountToken(userId: number, accountId: number) {
    return this.userHasAccessToAccountTokens(userId, accountId);
  }
  // #endregion

  // #region account bots
  public async userHasAccessToAccountBots(userId: number, accountId: number) {
    return this.userHasAccessToAccount(userId, accountId);
  }

  public async userCanCreateBot(userId: number, accountId: number) {
    return this.userHasAccessToAccountBots(userId, accountId);
  }

  public async userCanChangeBotState(userId: number, accountId: number) {
    return this.userHasAccessToAccountBots(userId, accountId);
  }

  public async userCanRemoveBot(userId: number, accountId: number) {
    return this.userHasAccessToAccountBots(userId, accountId);
  }

  public async userCanUpdateBot(userId: number, accountId: number) {
    return this.userHasAccessToAccountBots(userId, accountId);
  }
  // #endregion

  // #region account models
  public async userHasAccessToAccountModels(userId: number, accountId: number) {
    return this.userHasAccessToAccount(userId, accountId);
  }
  // #endregion

  // #region account members
  public async userHasAccessToAccountMembers(
    userId: number,
    accountId: number,
  ) {
    return this.userHasAccessToAccount(userId, accountId);
  }

  public async userCanInviteMembers(userId: number, accountId: number) {
    return this.userHasAccessToAccountMembers(userId, accountId);
  }

  public async userCanRemoveMembers(userId: number, accountId: number) {
    return this.userHasAccessToAccountMembers(userId, accountId);
  }

  public async userCanLeaveAccount(_userId: number, _accountId: number) {
    return true;
  }
  // #endregion

  // #endregion account
}
