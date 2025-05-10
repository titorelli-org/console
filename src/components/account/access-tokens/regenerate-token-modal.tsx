import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AffectedBotsList } from "./affected-bots-list";
import { useGetAffectedBots } from "@/hooks/use-get-affected-bots";

interface RegenerateTokenModalProps {
  isOpen: boolean;
  accountId: string;
  accessTokenId: string;
  onClose: () => void;
  onRegenerateToken: () => void;
}

export function RegenerateTokenModal({
  isOpen,
  accountId,
  accessTokenId,
  onClose,
  onRegenerateToken,
}: RegenerateTokenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Перевыпустить токен</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите перевыпустить этот токен?
            <br />
            Старый токен станет недействителен.
            <br />
            Вы увидите новый токен после перевыпуска.
            <br />
            Боты, которые будут затронуты этим действием будут перезапущены.
            <br />
            Если вы используете токен для других целей, обновить его придется
            вручную.
          </DialogDescription>
          <AffectedBotsList
            accountId={accountId}
            accessTokenId={accessTokenId}
          />
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onRegenerateToken}>Перевыпустить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
