"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RegenerateTokenModal } from "./regenerate-token-modal";
import { RevokeTokenModal } from "./revoke-token-modal";
import { AccessTokenVm } from "@/types/access-tokens";

interface TokenItemProps {
  token: AccessTokenVm;
  onRegenerateToken: (id: string) => void;
  onRevokeToken: (id: string) => void;
}

export function TokenItem({
  token,
  onRegenerateToken,
  onRevokeToken,
}: TokenItemProps) {
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

  const handleRegenerateToken = () => {
    onRegenerateToken(token.id);
    setIsRegenerateModalOpen(false);
  };

  return (
    <div className="grid grid-cols-12 gap-4 py-4 px-4 items-center">
      <div className="col-span-2 font-medium">{token.name}</div>
      <div className="col-span-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-500 truncate">
                {token.description}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{token.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {format(token.createdAt, "dd.MM.yyyy HH:mm")}
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {format(token.updatedAt, "dd.MM.yyyy HH:mm")}
      </div>
      <div className="col-span-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRegenerateModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Перевыпустить
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsRevokeModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Удалить
        </Button>
      </div>
      <RegenerateTokenModal
        isOpen={isRegenerateModalOpen}
        accountId={token.accountId}
        accessTokenId={token.id}
        onClose={() => setIsRegenerateModalOpen(false)}
        onRegenerateToken={handleRegenerateToken}
      />
      <RevokeTokenModal
        isOpen={isRevokeModalOpen}
        accountId={token.accountId}
        accessTokenId={token.id}
        onClose={() => setIsRevokeModalOpen(false)}
        onRevokeToken={() => onRevokeToken(token.id)}
      />
    </div>
  );
}
