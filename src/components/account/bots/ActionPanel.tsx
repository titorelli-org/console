"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, BarChart } from "lucide-react";
import type { BotState } from "@/types/bot";
import ConfirmationModal from "./ConfirmationModal";
import { BotStateHelper } from "@/lib/helpers/bot-state";

interface ActionPanelProps {
  botState: BotState;
  botName: string;
  onEdit: () => void;
  onDelete: () => void;
  onStateChange: (state: BotState) => void;
  onViewStats: () => void;
}

export default function ActionPanel({
  botState,
  botName,
  onEdit,
  onDelete,
  onStateChange,
  onViewStats,
}: ActionPanelProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const createChangeStateHandler = (state: BotState) => () =>
    onStateChange(state);

  const getStateChangeButton = () => {
    return new BotStateHelper(botState).getActionButton({
      createChangeStateHandler,
    });
  };

  return (
    <div className="flex space-x-2">
      {getStateChangeButton()}
      <Button size="sm" variant="outline" onClick={onEdit}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={onViewStats}>
        <BarChart className="w-4 h-4" />
      </Button>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDelete();
        }}
        title="Удалить"
        message={`Вы уверены, что хотите удалить бота "${botName}"? Это действие нельзя будет отменить`}
      />
    </div>
  );
}
