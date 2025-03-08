import { unmaskNumber } from "@/lib/server/keymask";
import { getModelsService, getSecurityService } from "@/lib/server/services/instances";
import { mapModelDtoToVm, ModelVM } from "@/types/model";
import { createZodRoute } from "next-zod-route";
import { z } from "zod";
import { unauthorized } from "next/navigation";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { securityCheck } from "@/lib/server/security-check";

export const GET = createZodRoute()
  .params(z.object({
    id: z.string()
  }))
  .handler(
    async (_req, { params }) => {
      const accountId = unmaskNumber(params.id)
      const user = await getUserInRoute()
  
      if (!accountId)
        unauthorized()
  
      if (!user)
        unauthorized()
  
      const securityService = getSecurityService()
  
      await securityCheck(securityService.userHasAccessToAccountModels, user.id, accountId)
  
      const modelsService = getModelsService()
      const models = await modelsService.list(accountId)
  
      return models.map(mapModelDtoToVm) as ModelVM[]
    }
  )

// export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
//   const { id: accountIdStr } = await paramsPromise
//   const accountId = unmaskNumber(accountIdStr)

//   if (accountId == null)
//     throw new Error('Account id not provided')

//   // TODO: Check if account exist and user have access to it

//   const modelsService = getModelsService()
//   const models = await modelsService.list(accountId)

//   const result: ModelVM[] = models.map(mapModelDtoToVm)

//   return NextResponse.json(result)
// }
