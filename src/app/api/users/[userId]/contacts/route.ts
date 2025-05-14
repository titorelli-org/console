import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { securityCheck } from "@/lib/server/security-check";
import {
  getSecurityService,
  getUserService,
} from "@/lib/server/services/instances";
import { mapUserContactToVm } from "@/types/my-profile";
import { createZodRoute } from "next-zod-route";
import { unauthorized } from "next/navigation";
import { z } from "zod";

export const GET = createZodRoute()
  .params(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async () => {
    const user = await getUserInRoute();

    if (!user) unauthorized();

    const securityService = getSecurityService();
    const userService = getUserService();

    await securityCheck(securityService.userHasAccessToContacts, user.id);

    const contacts = await userService.getContacts(user.id);

    return contacts.map(mapUserContactToVm);
  });
