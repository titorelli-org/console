import { AccessTokenVm } from "@/types/access-tokens";
import { TokenItem } from "./token-item";

interface TokenListProps {
  tokens: AccessTokenVm[];
  onRegenerateToken: (id: string) => void;
  onRevokeToken: (id: string) => void;
}

export function TokenList({
  tokens,
  onRegenerateToken,
  onRevokeToken,
}: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No access tokens found. Click &quot;Add New Token&quot; to create one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-12 gap-4 py-3 px-4 text-sm font-medium text-gray-500 border-b">
          <div className="col-span-2">Название</div>
          <div className="col-span-3">Описание</div>
          <div className="col-span-2">Создан</div>
          <div className="col-span-2">Последнее использование</div>
          <div className="col-span-3"></div>
        </div>
        <div className="divide-y">
          {tokens.map((token) => (
            <TokenItem
              key={token.id}
              token={token}
              onRegenerateToken={onRegenerateToken}
              onRevokeToken={onRevokeToken}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
