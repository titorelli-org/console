import { type FC } from "react";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useGetAffectedBots } from "@/hooks/use-get-affected-bots";
import { Skeleton } from "@/components/ui/skeleton";
import { BotStateHelper } from "@/lib";

export const AffectedBotsList: FC<{
  accountId: string;
  accessTokenId: string;
}> = ({ accountId, accessTokenId }) => {
  const { data: bots, isLoading: isBotsLoading } = useGetAffectedBots(
    accountId,
    accessTokenId,
  );
  const hasBots = bots != null && bots.length > 0;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md mb-4">
        <AlertCircle className="h-5 w-5" />
        {hasBots ? (
          <p className="text-sm">
            Боты, которые будут затронуты этим действием:
          </p>
        ) : (
          <p className="text-sm">Нет ботов, которые пользуются этим токеном.</p>
        )}
      </div>
      {hasBots && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isBotsLoading ? (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell className="text-zinc-500">
                        {bot.description}
                      </TableCell>
                      <TableCell>
                        {new BotStateHelper(bot.state).badgeText}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
