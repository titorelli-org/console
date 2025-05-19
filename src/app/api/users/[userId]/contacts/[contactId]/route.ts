import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unmaskNumber } from "@/lib/server/keymask";
import { OperationStatus } from "@/lib/server/OperationStatus";
import { securityCheck } from "@/lib/server/security-check";
import {
  getSecurityService,
  getUserService,
} from "@/lib/server/services/instances";
import { mapUserContactToVm } from "@/types/my-profile";
import { createZodRoute } from "next-zod-route";
import { unauthorized } from "next/navigation";
import { z } from "zod";

export const DELETE = createZodRoute()
  .params(
    z.object({
      userId: z.string(),
      contactId: z.string(),
    }),
  )
  .handler(async (_req, { params: { contactId: contactIdStr } }) => {
    const contactId = unmaskNumber(contactIdStr);
    const user = await getUserInRoute();

    if (!user) unauthorized();

    const securityService = getSecurityService();
    const userService = getUserService();

    await securityCheck(
      securityService.userCanDeleteContact,
      user.id,
      contactId,
    );

    return OperationStatus.invoke(() =>
      userService.deleteContact(user.id, contactId),
    );
  });
