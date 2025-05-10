"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { BotUpdateRequestDataVm, BotVm } from "@/types/bot";
import { FormProvider, useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { StyledErrorMessage } from "@/components/form/field-error";
import { BotCodePreview } from "./bot-code-preview";
import { ModelSelector } from "./model-selector";
import { TokenSelectorSkeleton, TokenSelector } from "./token-selector";
import { useGetAccountId } from "@/hooks/use-get-accountId";
import AddTokenModal from "./AddTokenModal";
import { useAddToken } from "@/hooks/use-add-token";
import { useBotControls } from "@/hooks/use-bot-controls";

interface EditBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: BotVm;
}

export type EditBotModalFormValues = BotUpdateRequestDataVm;

export default function EditBotModal({
  isOpen,
  bot,
  onClose,
}: EditBotModalProps) {
  const accountId = useGetAccountId()!;
  const { mutateAsync: addTokenAsyncMutation } = useAddToken(String(accountId));
  const { updateMutation } = useBotControls(bot.accountId);
  const form = useForm<EditBotModalFormValues>({
    defaultValues: {
      id: bot.id,
      name: bot.name,
      description: bot.description,
      bypassTelemetry: bot.bypassTelemetry,
      modelCode: "generic",
      accessTokenId: bot.accessTokenId,
    },
  });
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  const addTokenHandler = async (name: string, description: string) => {
    const newToken = await addTokenAsyncMutation({ name, description });

    // Если апдейт пройдет позже таймаута, то значение не автовыберется в списке
    // Не особо критично, но нужно будет поправить
    setTimeout(() => {
      form.setValue("accessTokenId", newToken.id);
    }, 600);

    setIsAddTokenModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование бота</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              updateMutation(values, {
                onSuccess() {
                  onClose();
                },
              });
            })}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Название</Label>
              <Input required id="name" {...form.register("name")} />
              <StyledErrorMessage name="name" />
              <BotCodePreview />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" {...form.register("description")} />
            </div>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="bypassTelemetry"
                render={({ field }) => (
                  <Checkbox
                    ref={field.ref}
                    id="telemetry"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Label htmlFor="telemetry">Отключить телеметрию</Label>
            </div>
            <div>
              <ModelSelector />
            </div>
            <div>
              <Suspense fallback={<TokenSelectorSkeleton />}>
                <TokenSelector
                  accountId={accountId}
                  onClickAdd={() => setIsAddTokenModalOpen(true)}
                />
              </Suspense>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Применить</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        onClose={() => setIsAddTokenModalOpen(false)}
        onAddToken={addTokenHandler}
      />
    </Dialog>
  );
}
