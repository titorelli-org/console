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

interface RevokeTokenModalProps {
  isOpen: boolean;
  accountId: string;
  accessTokenId: string;
  onClose: () => void;
  onRevokeToken: () => void;
}

export function RevokeTokenModal({
  isOpen,
  accountId,
  accessTokenId,
  onClose,
  onRevokeToken,
}: RevokeTokenModalProps) {
  const handleRevokeToken = () => {
    onRevokeToken();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить токен</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить токен?
            <br />
            Это действие нельзя будет отменить.
            <br />
            Затронутые этим действием боты будут остановлены и не смогут быть
            перезапущены, если не будет выбран новый токен.
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
          <Button variant="destructive" onClick={handleRevokeToken}>
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
