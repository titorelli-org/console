import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { type FC } from "react";
import type { UserContactVm } from "@/types/my-profile";
import { UserContactHelper } from "@/lib/helpers/user-contact-helper";

export const ContactItem: FC<{
  contact: UserContactVm;
  canRemove: boolean;
  onRemove(id: string): void;
}> = ({ contact, canRemove, onRemove }) => {
  return (
    <div key={contact.id} className="bg-background p-4 rounded-md">
      <div className="md:grid md:grid-cols-[1fr_3fr_2fr_1fr] md:gap-4 md:items-center">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          {new UserContactHelper(contact).listIcon}
          <span className="capitalize md:hidden font-medium text-sm text-muted-foreground">
            Тип:
          </span>
          <span className="capitalize">
            {new UserContactHelper(contact).displayType}
          </span>
        </div>
        <div className="mb-2 md:mb-0">
          <span className="md:hidden font-medium text-sm text-muted-foreground">
            Значение:{" "}
          </span>
          <span className="break-all">{contact.value}</span>
        </div>
        <div className="mb-2 md:mb-0">
          <span className="md:hidden font-medium text-sm text-muted-foreground">
            Статус:{" "}
          </span>
          {contact.status === "verified" ? (
            <span className="flex items-center text-green-500">
              <CheckCircle className="w-4 h-4 mr-1" /> Подтвержден
            </span>
          ) : (
            <span className="inline-flex items-center text-yellow-500">
              <XCircle className="w-4 h-4 mr-1" /> Не подтвержден
            </span>
          )}
        </div>
        <div>
          <span className="md:hidden font-medium text-sm text-muted-foreground">
            Действия:{" "}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(contact.id)}
            disabled={!canRemove}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};
