import {
  Tailwind,
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
  Text,
} from "@react-email/components";

interface EmailConfirmationProps {
  userFirstName: string;
  confirmationLink: string;
}

export default function EmailConfirmation({
  userFirstName = "Уважаемый пользователь",
  confirmationLink = "https://titorelli.ru/confirm-email",
}: EmailConfirmationProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Подтвердите ваш email для Titorelli</Preview>
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
              Подтверждение email адреса
            </Heading>
            <Text className="text-zinc-300 text-base mb-4">
              Здравствуйте, {userFirstName}!
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Спасибо за регистрацию в Titorelli. Для завершения процесса
              регистрации и подтверждения вашего email адреса, пожалуйста,
              нажмите на кнопку ниже.
            </Text>
            <Section className="text-center my-8">
              <Button
                href={confirmationLink}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-full text-lg font-semibold no-underline inline-block transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Подтвердить email
              </Button>
            </Section>
            <Text className="text-zinc-300 text-base mb-4">
              Если вы не регистрировались в Titorelli, пожалуйста,
              проигнорируйте это письмо.
            </Text>
            <Text className="text-zinc-300 text-base mb-4">
              Эта ссылка действительна в течение 24 часов. Если срок действия
              истек, вы можете запросить новую ссылку для подтверждения на нашем
              сайте.
            </Text>
            <Hr className="border-zinc-700 my-6" />
            <Text className="text-zinc-400 text-sm">
              Если у вас есть вопросы, пожалуйста, не стесняйтесь обращаться к
              нам по адресу{" "}
              <Link
                href="mailto:support@titorelli.ru"
                className="text-zinc-500 underline"
              >
                support@titorelli.ru
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
