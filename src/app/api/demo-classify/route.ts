import { createClient } from "@titorelli/client";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { env } from "@/lib/server/env";
import { memoize } from "@/lib/server/service-memoize";

const getTitorelli = memoize(() =>
  createClient({
    serviceUrl: env.TITORELLI_SERVICE_URL,
    clientId: "demo",
    clientSecret: env.TITORELLI_DEMO_CLIENT_SECRET,
    scope: ["predict"],
    modelId: "generic",
  }),
);

export const POST = createZodRoute()
  .body(
    z.object({
      tgUserId: z.number().optional(),
      text: z.string(),
    }),
  )
  .handler(async (_req, { body: { tgUserId, text } }) => {
    const titorelli = getTitorelli();

    return titorelli.predict({ tgUserId, text });
  });
