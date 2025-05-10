import { maskNumber } from "@/lib/server/keymask";
import type { AccessToken } from "@prisma/client";

export type AccessTokenVm = {
  id: string;
  name: string;
  description: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
};

export type AccessTokenCreatedRequestDataVm = {
  name: string;
  description?: string;
};

export type AccessTokenCreatedResultVm = {
  id: string;
  token: string;
};

export const mapAccessTokenDtoToVm = ({
  id,
  name,
  description,
  accountId,
  createdAt,
  updatedAt,
}: AccessToken): AccessTokenVm => ({
  id: maskNumber(id),
  name,
  description,
  accountId: maskNumber(accountId),
  createdAt: createdAt.toISOString(),
  updatedAt: updatedAt.toISOString(),
});
