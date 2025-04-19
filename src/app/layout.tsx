import { Suspense, use } from "react";
import { Geist } from "next/font/google";

import { MetrikaScript } from "@/components/metrika-script";

import { cookies } from "next/headers";
import { Providers } from "@/providers";
import { sessionTokenCookieName } from "@/constants";

import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Titorelli - Manage Classification Models for Telegram Bots",
  description:
    "Titorelli platform helps you manage classification models for Telegram bots, providing advanced spam protection features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = use(cookies());
  const sessionStr = c.get(sessionTokenCookieName)?.value ?? null;

  return (
    <html lang="ru">
      <body className={geist.className}>
        <Providers session={sessionStr}>{children}</Providers>
        {process.env.NODE_ENV === "production" && (
          <Suspense>
            <MetrikaScript />
          </Suspense>
        )}
      </body>
    </html>
  );
}
