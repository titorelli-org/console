import { NextResponse } from "next/server";
import { env } from "@/lib/server/env";
import { cookies } from "next/headers";
import { sessionTokenCookieName } from "@/constants";

export const GET = async () => {
  const c = await cookies();

  c.delete(sessionTokenCookieName);

  return NextResponse.redirect(`${env.SITE_ORIGIN}/auth/signout/success`);
};
