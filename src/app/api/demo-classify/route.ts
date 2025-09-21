import { createClient, serviceDiscovery } from "@titorelli/client";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { env } from "@/lib/server/env";
import { memoize } from "@/lib/server/service-memoize";

const getTitorelli = memoize(async () => {
  const { modelOrigin } = await serviceDiscovery(env.SITE_ORIGIN);

  return createClient("model", {
    baseUrl: modelOrigin,
    auth: {
      clientName: "console",
      initialAccessToken: env.INITIAL_ACCESS_TOKEN,
    },
  });
});

export const POST = createZodRoute()
  .body(
    z.object({
      tgUserId: z.number().optional(),
      text: z.string(),
    }),
  )
  .handler(async (_req, { body: { text } }) => {
    const titorelli = await getTitorelli();

    return titorelli.predict({ text });
  });
