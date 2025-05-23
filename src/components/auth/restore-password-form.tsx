"use client";

import React, { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/form/field-error";
import Link from "next/link";
import { restoreFormInitialState } from "@/constants";
import { isEmpty } from "lodash";

export type RestoreFormProps = React.ComponentPropsWithoutRef<"form">;

export type RestoreFormState = {
  success?: boolean | null;
  defaultValues: {
    identity: string;
  };
  errors: {
    identity?: string;
    password?: string;
  };
};

export function RestorePasswordForm({
  className,
  action,
  ...props
}: RestoreFormProps) {
  const [{ success, defaultValues, errors }, formAction] =
    useActionState<RestoreFormState>(action as any, restoreFormInitialState);

  if (success === true) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">
            Ссылка на сброс пароля отправлена
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Убедитесь, что вы имеете доступ к почтовому ящику, на который был
            зарегистрирован аккаунт
          </p>
          <p className="text-balance text-sm text-muted-foreground">
            Перейдите в почтовый клиент и найдите письмо от
            &quot;restore-password@titorelli.ru&quot;
          </p>
          <p className="text-balance text-sm text-muted-foreground">
            Если письмо не пришло, проверьте папку &quot;спам&quot;
          </p>
        </div>
      </div>
    );
  } else if (success === false && isEmpty(errors)) {
    return (
      <div className={"flex flex-col gap-6"}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">
            Ссылка на сброс пароля не была отправлена
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Если для восстановления доступа вы указывали никнейм или номер
            телефона, значит, у вас нет подтвержденного емейла
          </p>
          <p className="text-balance text-sm text-muted-foreground">
            Попробуйте указать емейл, на который следует выслать ссылку на
            восттановление пароля
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Восстановление доступа</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Введите данные, указанные при регистраци
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="identity">Email, телефон или ник</Label>
          <Input
            id="identity"
            type="text"
            name="identity"
            defaultValue={defaultValues.identity}
            placeholder="oleg@example.com"
            required
          />
          <FieldError errors={errors} field="identity" />
        </div>
        <Button type="submit" className="w-full">
          Восстановить пароль
        </Button>
        <FieldError errors={errors} field="_global" />
      </div>
      <div className="text-center text-sm">
        Нет профиля?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}
