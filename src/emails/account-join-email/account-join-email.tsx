import { UserAccountRoleHelper } from "@/lib/helpers/user-account-role-helper";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ProjectJoinInviteProps {
  inviteeEmail: string;
  inviterName: string;
  projectName: string;
  invitedRole: string;
  joinLink: string;
}

export default function AccountJoinInvite({
  inviteeEmail = "user@example.com",
  inviterName = "Иван Петров",
  projectName = "Мой проект",
  invitedRole = "viewer",
  joinLink = "https://titorelli.ru/join-project?token=abc123",
}: ProjectJoinInviteProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Вас пригласили присоединиться в аккаунт {projectName} на Titorelli
      </Preview>
      <Tailwind>
        <Body className="bg-zinc-900 font-sans">
          <Container className="mx-auto px-6 py-8 w-full max-w-xl">
            <Img
              src={`https://titorelli.ru/logo.png`}
              width="170"
              height="50"
              alt="Логотип Titorelli"
              className="mx-auto mb-6"
            />
            <Heading className="text-zinc-100 text-2xl font-bold text-center mb-4">
              Приглашение в аккаунт
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {inviteeEmail}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              {inviterName} приглашает вас присоединиться к аккаунту &quot;
              {projectName}&quot; на платформе Titorelli.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Ваша роль:{" "}
              {new UserAccountRoleHelper(invitedRole as any).displayName}
            </Text>
            <Section className="text-center my-8">
              <Button
                href={joinLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Присоединиться
              </Button>
            </Section>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы не хотите присоединяться к этому проекту или считаете, что
              это приглашение отправлено вам по ошибке, просто проигнорируйте
              это письмо.
            </Text>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если у вас возникли вопросы или вам нужна помощь, пожалуйста,
              обратитесь в нашу службу поддержки по адресу{" "}
              <Link
                href="mailto:support@titorelli.ru"
                className="text-zinc-500 underline"
              >
                support@titorelli.ru
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
