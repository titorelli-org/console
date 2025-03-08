import { unauthorized } from "next/navigation";
import { createZodRoute } from "next-zod-route";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { getUserNotificationService } from "@/lib/server/services/instances";

export const GET = createZodRoute()
  .handler(async () => {
    const user = await getUserInRoute()

    if (!user)
      unauthorized()

    const userNotificationService = getUserNotificationService()

    return {
      unreadCount: await userNotificationService.countUnread(user.id)
    }
  })

// export const GET = async ({}: NextRequest) => {
//   const user = await getUserInRoute()

//   if (!user)
//     throw new Error('User not authenticated for route')

//   const userNotificationService = getUserNotificationService()

//   return NextResponse.json({
//     unreadCount: await userNotificationService.countUnread(user.id)
//   })
// }
