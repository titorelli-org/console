import { unauthorized } from "next/navigation";
import { z } from "zod";
import { createZodRoute } from "next-zod-route";
import { getUserNotificationService } from "@/lib/server/services/instances";
import { unmaskNumber } from "@/lib/server/keymask";
import { getUserInRoute } from "@/lib/server/get-user-in-route";

export const POST = createZodRoute()
  .body(z.object({
    ids: z.array(z.string())
  }))
  .handler(async (_, { body }) => {
    const user = await getUserInRoute()

    if (!user)
      unauthorized()

    const userNotificationService = getUserNotificationService()
    
    await userNotificationService.markReceived(body.ids.map(idStr => unmaskNumber(idStr)))

    return null
  })
