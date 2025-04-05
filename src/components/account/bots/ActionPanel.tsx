"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Trash2, Edit, BarChart } from "lucide-react";
import type { BotState } from "@/types/bot";
import ConfirmationModal from "./ConfirmationModal";

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
    switch (botState) {
      case "created":
      case "stopped":
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <Play className="w-4 h-4 mr-1" /> Запустить
          </Button>
        );
      case "running":
        return (
          <Button size="sm" onClick={createChangeStateHandler("stopped")}>
            <Square className="w-4 h-4 mr-1" /> Остановить
          </Button>
        );
      case "starting":
      case "stopping":
        return (
          <Button size="sm" onClick={createChangeStateHandler("stopped")}>
            Отменить
          </Button>
        );
      case "failed":
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Перезагрузить
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={createChangeStateHandler("running")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Сделать что-нибудь
          </Button>
        );
    }
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
