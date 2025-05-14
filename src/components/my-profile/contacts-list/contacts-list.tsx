"use client";

import { type FC } from "react";
import { ContactItem } from "./contact-item";
import { AddContactForm } from "./add-contact-form";
import { useGetOwnContacts } from "@/hooks/use-get-own-contacts";
import { UserContactVm } from "@/types/my-profile";
import { useContactControls } from "@/hooks/use-contact-controls";

export type ContactType = "email" | "phone" | "telegram";

export const ContactsList: FC<{ userId: string }> = ({ userId }) => {
  const { data: contacts = [] } = useGetOwnContacts(userId);
  const { deleteMutation } = useContactControls(userId);

  const canRemoveContact = (
    selfContact: UserContactVm,
    contactsWithoutSelf: UserContactVm[],
  ) => {
    const sameTypeContacts = contactsWithoutSelf.filter(
      (c) => c.type === selfContact.type,
    );

    if (sameTypeContacts.length >= 1) {
      return true;
    }

    return false;
  };

  return (
    <div className="bg-muted p-6 rounded-lg space-y-6">
      <h3 className="text-lg font-semibold">Контактная информация</h3>
      <div className="hidden md:grid md:grid-cols-[1fr_3fr_2fr_1fr] gap-4 font-medium text-sm text-muted-foreground mb-2">
        <div>Тип</div>
        <div>Значение</div>
        <div>Статус</div>
        <div>Действия</div>
      </div>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            canRemove={canRemoveContact(
              contact,
              contacts.filter((c) => c.id !== contact.id),
            )}
            onRemove={(id) => deleteMutation({ id })}
          />
        ))}
      </div>
      <AddContactForm />
    </div>
  );
};
