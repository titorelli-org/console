import { createSecretKey } from "crypto";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { addDays, endOfDay, addHours, differenceInHours } from "date-fns";
import { env } from "@/lib/server/env";
import { maskNumber, unmaskNumber } from "../keymask";
import { prismaClient } from "../prisma-client";

export type EmailVerificationTokenPayload = JWTPayload & { contactId: string };

export class TokenService {
  private readonly prisma = prismaClient;
  private readonly siteOrigin = env.SITE_ORIGIN;
  private readonly apiOrigin = env.API_ORIGIN;
  private readonly secretKey = createSecretKey(env.JWT_SECRET, "utf-8");
  private readonly tokenResetPasswordValidityPeriodInHours = 24;
  private readonly tokenDeleteAccountValidityPeriodInHours = 24;
  private readonly tokenAccountJoinValidityPeriodInHours = 24;
  private readonly emailVerificationTokenValidityPeriodInDays = 30;

  async generateSignupPrefilledValidationToken(searchParams: URLSearchParams) {
    const payload: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    const token = await new SignJWT(payload)
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return token;
  }

  async validateSignupPrefilledValidationToken(
    rawSearchParams: Record<string, string>,
    token: string,
  ) {
    const searchParams = new URLSearchParams(rawSearchParams);
    const { payload } = await jwtVerify(token, this.secretKey);
    let success = true;

    searchParams.forEach((value, key) => {
      if (key === "v") return;

      if (!success) return;

      if (value !== Reflect.get(payload, key)) {
        success = false;
      }
    });

    return success;
  }

  async generateEmailVerificationToken(contactId: number) {
    const expiredAt = this.getExpiredAt(
      this.emailVerificationTokenValidityPeriodInDays,
    );
    const token = await new SignJWT({ contactId: maskNumber(contactId) })
      .setAudience(this.siteOrigin)
      .setExpirationTime(expiredAt)
      .setNotBefore(new Date())
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  async generateApiAccessToken(accountId: number) {
    const token = await new SignJWT({
      aid: maskNumber(accountId),
    })
      .setAudience(this.apiOrigin)
      .setNotBefore(new Date())
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return token;
  }

  async parseEmailVerificationToken(token: string) {
    const { payload } = await jwtVerify<EmailVerificationTokenPayload>(
      token,
      this.secretKey,
    );

    return {
      contactId: payload.contactId,
    };
  }

  /**
   * @todo
   * Обработать ситуацию, когда токен на восстановление
   * пароля неверный или протух
   */
  async validateRestorePasswordTokenFromEmail(token: string) {
    const tokenValid = await this.verifyToken(token);

    if (!tokenValid) return false;

    const resetPasswordRequest =
      await this.prisma.userResetPasswordRequest.findFirst({
        where: {
          token,
        },
      });

    if (!resetPasswordRequest) return false;

    const { expiredAt } = resetPasswordRequest;

    /**
     * @todo Fix `expired` calculation. Now it's just wrong
     */
    const expired =
      differenceInHours(new Date(), expiredAt) >
      this.tokenResetPasswordValidityPeriodInHours;

    if (expired) {
      return false;
    }

    return true;
  }

  async validateAccountJoinTokenFromEmail(token: string) {
    const tokenValid = await this.verifyToken(token);

    if (!tokenValid) return false;

    const payload = await this.parseAccountJoinTokenFromEmail(token);

    if (!payload) return false;

    const inviteId = unmaskNumber(payload.inviteId);

    const invite = await this.prisma.accountInvite.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invite) return false;

    const expired = invite.expiredAt.getTime() - new Date().getTime() < 0;

    if (expired) {
      return false;
    }

    return true;
  }

  public async parseRestorePasswordTokenFromEmail(token: string) {
    if (!(await this.validateRestorePasswordTokenFromEmail(token))) return null;

    const { payload } = await jwtVerify(token, this.secretKey);

    return payload;
  }

  public async generateResetPasswordToken(
    userId: number,
  ): Promise<[string, Date]> {
    const expiredAt = addHours(
      new Date(),
      this.tokenResetPasswordValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  public async generateDeleteAccountToken(accountId: number, userId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenDeleteAccountValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      accountId: maskNumber(accountId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  public async generateKeepAccountToken(accountId: number, userId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenDeleteAccountValidityPeriodInHours,
    );
    const token = await new SignJWT({
      sub: maskNumber(userId),
      accountId: maskNumber(accountId),
      exp: expiredAt.getTime() / 1000, // Date in future in seconds
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  public async generateAccountJoinToken(inviteId: number) {
    const expiredAt = addHours(
      new Date(),
      this.tokenAccountJoinValidityPeriodInHours,
    );
    const token = await new SignJWT({
      inviteId: maskNumber(inviteId),
      exp: expiredAt.getTime() / 1000,
    })
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey);

    return [token, expiredAt];
  }

  private async parseAccountJoinTokenFromEmail(token: string) {
    const { payload } = await jwtVerify(token, this.secretKey);

    return payload as typeof payload & { inviteId: string };
  }

  private async verifyToken(token: string) {
    try {
      await jwtVerify(token, this.secretKey);

      return true;
    } catch (e: unknown) {
      console.error(e);

      return false;
    }
  }

  private getExpiredAt(validityPeriodInDays: number) {
    return endOfDay(addDays(new Date(), validityPeriodInDays));
  }
}
