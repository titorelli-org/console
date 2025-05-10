import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import { ManagedBot } from "@prisma/client";

export type BotState =
  | "created"
  | "starting"
  | "running"
  | "stopping"
  | "stopped"
  | "failed"
  | "deleted";

export type BotCreateRequestDataVm = {
  name: string;
  description: string;
  bypassTelemetry: boolean;
  startImmediately: boolean;
  modelCode: string;
  accessTokenId: string;
  tgBotToken: string;
};

export type BotUpdateRequestDataVm = {
  id: string;
  name?: string;
  description?: string;
  bypassTelemetry?: boolean;
  modelCode?: string;
  accessTokenId?: string;
};

export interface BotVm {
  id: string;
  name: string;
  description: string;
  state: BotState;
  bypassTelemetry: boolean;
  accessTokenId: string;
  modelId: string;
  accountId: string;
  createdAt: string;
}

export type BotStateChangeRequestDataVm = {
  id: string;
  state: BotState;
};

export type BotStateChangeResultVm = {
  state: BotState;
};

export const mapBotDtoToVm = ({
  id,
  name,
  description,
  state,
  bypassTelemetry,
  accessTokenId,
  modelId,
  accountId,
  createdAt,
}: ManagedBot & { state: BotState }): BotVm => ({
  id: maskNumber(id),
  name,
  description,
  state,
  bypassTelemetry,
  accessTokenId: maskNumber(accessTokenId),
  modelId: maskNumber(modelId),
  accountId: maskNumber(accountId),
  createdAt: createdAt.toISOString(),
});

export const mapUpdateRequestToDto = ({
  id,
  name,
  description,
  bypassTelemetry,
  modelCode,
  accessTokenId,
}: BotUpdateRequestDataVm) => ({
  id: unmaskNumber(id),
  name,
  description,
  bypassTelemetry,
  modelCode,
  accessTokenId: unmaskNumber(accessTokenId),
});
