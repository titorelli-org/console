import type { UserNotification } from '@prisma/client'
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { getUserNotificationService } from "@/lib/server/services/instances";
import type { HeaderNotificationVm } from "@/types/user-notification";
import { maskNumber } from "@/lib/server/keymask";
import { PaginatedItems } from "@/lib/server/PaginatedItems";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { unauthorized } from "next/navigation";

const dbNotificationToVm = ({
  id,
  flash,
  type,
  payload,
  createdAt,
  read,
  received
}: UserNotification) => ({
  id: maskNumber(id),
  flash,
  type,
  payload: JSON.parse(payload),
  createdAt: createdAt.toISOString(),
  read,
  received
} as HeaderNotificationVm)

export const POST = createZodRoute()
  .body(z.object({
    page: z.number(),
    size: z.number()
  }))
  .handler(async (_, { body }) => {
    const user = await getUserInRoute()

    if (!user)
      unauthorized()

    const userNotificationService = getUserNotificationService()

    const [notifications, total] = await userNotificationService.getPaginatedNotifications(user.id, body.page, body.size)

    return new PaginatedItems(
      notifications.map(dbNotificationToVm),
      total,
      body.page,
      body.size
    )
  })
