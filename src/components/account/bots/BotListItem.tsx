"use client";

import { useState } from "react";
import type { BotVm } from "@/types/bot";
import BotDescription from "./BotDescription";
import StateBadge from "./StateBadge";
import ActionPanel from "./ActionPanel";
import EditBotModal from "./EditBotModal";
import { useBotControls } from "@/hooks/use-bot-controls";
import { format } from "date-fns";

interface BotListItemProps {
  bot: BotVm;
  accountId: string;
}

export default function BotListItem({ bot, accountId }: BotListItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { stateMutation, removeMutation } = useBotControls(accountId);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {bot.name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <BotDescription description={bot.description} />
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {format(bot.createdAt, "dd.MM.yyyy hh:mm")}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <StateBadge state={bot.state} />
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          Generic
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={bot.bypassTelemetry}
            readOnly
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <ActionPanel
            botState={bot.state}
            botName={bot.name}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => removeMutation({ id: bot.id })}
            onStateChange={(state) => stateMutation({ state, id: bot.id })}
            onViewStats={() => {}}
          />
        </td>
      </tr>
      <EditBotModal
        isOpen={isEditModalOpen}
        bot={bot}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
