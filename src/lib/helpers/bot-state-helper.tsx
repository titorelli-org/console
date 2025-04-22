import { type BotState } from "@/types/bot";

import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Trash2 } from "lucide-react";

export class BotStateHelper {
  constructor(private state: BotState) {}

  public get badgeColorClass() {
    switch (this.state) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "starting":
        return "bg-yellow-100 text-yellow-800";
      case "running":
        return "bg-green-100 text-green-800";
      case "stopping":
        return "bg-orange-100 text-orange-800";
      case "stopped":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  public get badgeText() {
    switch (this.state) {
      case "created":
        return "Создан";
      case "starting":
        return "Запускается";
      case "running":
        return "Работает";
      case "stopping":
        return "Останавливается";
      case "stopped":
        return "Остановлен";
      case "failed":
        return "Упал";
      case "deleted":
        return "Удален";
      default:
        return "Не понятно";
    }
  }

  getActionButton({
    createChangeStateHandler,
  }: {
    createChangeStateHandler(state: BotState): () => void;
  }) {
    switch (this.state) {
      case "created":
      case "stopped":
      case "failed":
        return (
          <Button size="sm" onClick={createChangeStateHandler("starting")}>
            {this.state === "failed" ? (
              <>
                <RotateCcw className="w-4 h-4 mr-1" /> Перезагрузить
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Запустить
              </>
            )}
          </Button>
        );
      case "deleted":
        return (
          <Button size="sm" onClick={createChangeStateHandler("deleted")}>
            <Trash2 className="w-4 h-4 mr-1" /> Убрать из списка
          </Button>
        );
      case "running":
      case "starting":
      case "stopping":
        return (
          <Button loading size="sm">
            {this.badgeText}
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={createChangeStateHandler("starting")}>
            <RotateCcw className="w-4 h-4 mr-1" /> Сделать что-нибудь
          </Button>
        );
    }
  }
}
