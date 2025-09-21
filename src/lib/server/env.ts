import "server-only";

import { cleanEnv, str, url, num, CleanedEnv } from "envalid";

const config = {
  NODE_ENV: str(),
  SITE_ORIGIN: url(),
  API_ORIGIN: url(),
  DATABASE_URL: str(),
  PASSWORD_PEPPER: str(),
  JWT_SECRET: str(),
  SMTP_PASS_RESTORE_PASSWORD: str(),
  SMTP_PASS_NOREPLY: str(),
  TITORELLI_SERVICE_URL: url(),
  TITORELLI_CLIENT_SECRET: str(),
  TITORELLI_DEMO_CLIENT_SECRET: str(),
  OO_BASE_URL: url(),
  OO_AUTH_CRED: str(),
  KEYMASK_SEED: str(),
  NEXT_PUBLIC_YM_COUNTER_ID: num(),
  INITIAL_ACCESS_TOKEN: str(),
} as const;

export let env: CleanedEnv<typeof config>;

if (process.env.NEXT_PHASE === "phase-production-build") {
  env = process.env as any;
} else {
  env = cleanEnv(process.env, config);
}
