import { BotStateHelper } from "@/lib/helpers/bot-state";
import type { BotState } from "@/types/bot";

interface StateBadgeProps {
  state: BotState;
}

const getColorClass = (state: BotState) => {
  return new BotStateHelper(state).badgeColorClass;
};

const getStateText = (state: BotState) => {
  return new BotStateHelper(state).badgeText;
};

export default function StateBadge({ state }: StateBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClass(state)}`}
    >
      {getStateText(state)}
    </span>
  );
}
