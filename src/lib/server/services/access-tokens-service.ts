import { prismaClient } from "../prisma-client";
import { Prisma } from "@prisma/client";
import { getTokenService } from "./instances";

export class AcccessTokenService {
  private prisma = prismaClient;

  private get tokenService() {
    return getTokenService();
  }

  public async listByAccountId(accountId: number) {
    return this.prisma.accessToken.findMany({
      where: { accountId, revoked: { not: true } },
    });
  }

  public async create(accountId: number, name: string, description?: string) {
    const token = await this.generateToken(accountId);

    const { id } = await this.prisma.accessToken.create({
      data: {
        token,
        description,
        name,
        accountId,
      },
    });

    return { token, id };
  }

  public async revoke(tokenId: number) {
    await this.prisma.accessToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  public async regenerate(tokenId: number) {
    const accessToken = await this.prisma.accessToken.findFirst({
      where: { id: tokenId },
      select: {
        accountId: true,
      },
    });

    if (!accessToken)
      throw new Error(`Access token with id = ${tokenId} not found`);

    const token = await this.generateToken(accessToken.accountId);

    await this.prisma.accessToken.update({
      where: { id: tokenId },
      data: { token },
    });

    return { token, id: tokenId };
  }

  public async privateGetToken(tokenId: number, t?: Prisma.TransactionClient) {
    const accessToken = await (t ?? this.prisma).accessToken.findFirst({
      where: { id: tokenId },
      select: {
        token: true,
      },
    });

    return accessToken?.token ?? null;
  }

  private async generateToken(accountId: number) {
    return this.tokenService.generateApiAccessToken(accountId);
  }
}
