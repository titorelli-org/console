import { randomBytes } from "crypto";
import { prismaClient } from "../prisma-client";
import { Prisma } from "@prisma/client";

export class AcccessTokenService {
  private prisma = prismaClient;

  public async list(accountId: number) {
    return this.prisma.accessToken.findMany({
      where: { accountId, revoked: { not: true } },
    });
  }

  public async create(accountId: number, name: string, description?: string) {
    const token = this.generateToken();

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
    const token = this.generateToken();

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

  private generateToken() {
    return randomBytes(20).toString("hex");
  }
}
