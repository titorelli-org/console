import type { Account, AccountInvite, User, UserContact } from "@prisma/client";
import { prismaClient } from "@/lib/server/prisma-client";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/emails/reset-password/reset-password";
import AccountRemovalNotificationEmail from "@/emails/account-removal-notification";
import AccountRemovalConfirmation from "@/emails/account-removal-confirmation-email";
import EmailConfirmation from "@/emails/email-confirmation/email-confirmation";
import AccountJoinInvite from "@/emails/account-join-email/account-join-email";
import { env } from "@/lib/server/env";
import { getEmailClient, getTokenService, getUserService } from "./instances";

export class EmailService {
  private prisma = prismaClient;
  private siteOrigin = env.SITE_ORIGIN;

  get emailClient() {
    return getEmailClient();
  }

  get userService() {
    return getUserService();
  }

  get tokenService() {
    return getTokenService();
  }

  public async sendEmailVerificationRequest(userId: number, email: string) {
    const user = await this.userService.getUser(userId);

    if (!user) throw new Error(`Cannot find user by id = ${userId}`);

    const confirmationHref = await this.getEmailConfirmationLink(userId, email);
    const emailHtml = await render(
      <EmailConfirmation
        userFirstName={user.username}
        confirmationLink={confirmationHref}
      />,
    );

    await this.emailClient.sendHTML(
      "noreply@titorelli.ru",
      email,
      "Подтвердите емейл, указанный при регистрации на Titorelli",
      emailHtml,
    );
  }

  public async sendRestorePasswordEmail(userId: number, email: string | "*") {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error(`Can't find user with id = ${userId}`);

    const emailContacts: UserContact[] = [];

    if (email === "*") {
      const manyEmailContacts = await this.prisma.userContact.findMany({
        where: {
          userId: user.id,
          type: "email",
          emailConfirmed: true,
        },
      });

      emailContacts.push(...manyEmailContacts);
    } else {
      const emailContact = await this.prisma.userContact.findFirst({
        where: {
          userId: user.id,
          type: "email",
          email,
        },
      });

      if (emailContact) {
        emailContacts.push(emailContact);
      }
    }

    let result = false;

    for (const contact of emailContacts) {
      if (!contact) continue;
      if (contact.email == null) continue;
      if (contact.email === "") continue;

      const resetHref = await this.getResetPasswordHref(user);
      const emailHtml = await render(
        <ResetPasswordEmail username={user.username} resetHref={resetHref} />,
      );

      await this.emailClient.sendHTML(
        "restore-password@titorelli.ru",
        contact.email,
        "Восстановление пароля на платформе Titorelli",
        emailHtml,
      );

      result = true;
    }

    return result;
  }

  public async sendDeleteAccountConfirmationEmail(accountId: number) {
    const ownerMember = await this.prisma.accountMember.findFirst({
      where: {
        accountId,
        role: "owner",
      },
      include: {
        user: {
          include: {
            contacts: {
              where: { type: "email", emailConfirmed: true },
            },
          },
        },
        account: true,
      },
    });

    if (!ownerMember)
      throw new Error(
        `Account owner not found in account id = ${accountId} members list`,
      );

    if (!ownerMember.user) throw new Error("Owner model don't have user");

    for (const { email } of ownerMember.user.contacts) {
      if (email == null) continue;
      if (email === "") continue;

      const emailHtml = await render(
        <AccountRemovalConfirmation
          ownerName={ownerMember.user.username}
          accountName={ownerMember.account.name}
          confirmationLink={await this.getAccountDeletionConfirmationHref(
            accountId,
            ownerMember.user.id,
          )}
          cancellationLink={await this.getAccountDeletionCancellationHref(
            accountId,
            ownerMember.user.id,
          )}
        />,
      );

      await this.emailClient.sendHTML(
        "noreply@titorelli.ru",
        email,
        `Подтвердите удаление аккаунта "${ownerMember.account.name}" на Titorelli`,
        emailHtml,
      );
    }

    return true;
  }

  public async sendInviteToEmail(
    email: string,
    account: Account,
    invite: AccountInvite,
  ) {
    const ownerMember = await this.prisma.accountMember.findFirst({
      where: {
        accountId: account.id,
        role: "owner",
      },
      include: {
        user: true,
      },
    });

    if (!ownerMember)
      throw new Error(`Owner can't be found in account id = ${account.id}`);

    const joinLink = await this.getAccountJoinHref(invite);

    const emailHtml = await render(
      <AccountJoinInvite
        inviteeEmail={email}
        inviterName={ownerMember.user.username}
        projectName={account.name}
        invitedRole={invite.role}
        joinLink={joinLink}
      />,
    );

    await this.emailClient.sendHTML(
      "noreply@titorelli.ru",
      email,
      `Вас пригласили в аккаунт "${account.name}" на Titorelli`,
      emailHtml,
    );
  }

  public async sendWipeAccountNotificationEmail(accountId: number) {
    const members = await this.prisma.accountMember.findMany({
      where: { accountId },
      include: {
        user: {
          include: {
            contacts: {
              where: {
                type: "email",
                emailConfirmed: true,
              },
            },
          },
        },
        account: true,
      },
    });

    const ownerMember = members.find(({ role }) => role === "owner");

    if (!ownerMember)
      throw new Error(
        `Account owner not found in account id = ${accountId} members list`,
      );

    if (!ownerMember.user) throw new Error("Owner member not have user");

    for (const member of members) {
      if (!member.user) continue;

      const { user, account } = member;

      for (const { email } of user?.contacts ?? []) {
        if (email == null) continue;
        if (email === "") continue;

        const emailHtml = await render(
          <AccountRemovalNotificationEmail
            memberName={user.username}
            accountName={account.name}
            ownerName={ownerMember.user.username}
            supportLink={`${this.siteOrigin}/support`}
          />,
        );

        await this.emailClient.sendHTML(
          "noreply@titorelli.ru",
          email,
          `Удаление аккаунта "${account.name}" на Titorelli`,
          emailHtml,
        );
      }
    }
  }

  private async getEmailConfirmationLink(userId: number, email: string) {
    const contact = await this.prisma.userContact.findFirstOrThrow({
      where: {
        userId,
        email,
      },
    });

    const [token] = await this.tokenService.generateEmailVerificationToken(
      contact.id,
    );

    return `${this.siteOrigin}/from-email/email-confirmation?t=${token}`;
  }

  private async getAccountJoinHref(invite: AccountInvite) {
    const [token] = await this.tokenService.generateAccountJoinToken(invite.id);

    return `${this.siteOrigin}/from-email/account-join-confirmation?t=${token}`;
  }

  private async getAccountDeletionConfirmationHref(
    accountId: number,
    userId: number,
  ) {
    const [token] = await this.tokenService.generateDeleteAccountToken(
      accountId,
      userId,
    );

    return `${this.siteOrigin}/from-email/account-delete-confirmation?t=${token}`;
  }

  private async getAccountDeletionCancellationHref(
    accountId: number,
    userId: number,
  ) {
    const [token] = await this.tokenService.generateKeepAccountToken(
      accountId,
      userId,
    );

    return `${this.siteOrigin}/from-email/account-delete-cancellation?t=${token}`;
  }

  private async getResetPasswordHref(user: User) {
    const [token, expiredAt] =
      await this.tokenService.generateResetPasswordToken(user.id);

    await this.createResetPasswordRequest(user.id, token, expiredAt);

    const url = new URL(`/auth/restore/reset/${token}`, this.siteOrigin);

    return url.toString();
  }

  /**
   * @todo Maybe get rid of concept of separate request
   */
  private async createResetPasswordRequest(
    userId: number,
    token: string,
    expiredAt: Date,
  ) {
    await this.prisma.userResetPasswordRequest.create({
      data: {
        token,
        expiredAt,
        userId: userId,
      },
    });
  }
}
