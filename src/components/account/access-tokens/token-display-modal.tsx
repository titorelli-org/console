"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TokenDisplayModalProps {
  token: string | null;
  onClose: () => void;
}

export function TokenDisplayModal({ token, onClose }: TokenDisplayModalProps) {
  if (!token) return null;

  return (
    <Dialog open={!!token} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Токен создан</DialogTitle>
          <DialogDescription>
            Пожалуйста, скопируйте токен и сохраните его в надежном месте.
            <br />
            Больше увидеть токен не получится.
          </DialogDescription>
        </DialogHeader>
        <pre className="bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
          {token}
        </pre>
        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
