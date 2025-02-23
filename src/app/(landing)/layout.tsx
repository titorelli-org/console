import { AppLayout } from "@/layouts/app-layout";

export const metadata = {
  title: "Titorelli - Manage Classification Models for Telegram Bots",
  description:
    "Titorelli platform helps you manage classification models for Telegram bots, providing advanced spam protection features.",
};

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
