import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber } from "@/lib/server/keymask"
import { UserAccountVm } from "@/types/header"
import { getAccountService } from "@/lib/server/services/instances"
import { unauthorized } from "next/navigation"
import { createZodRoute } from "next-zod-route"

export const GET = createZodRoute()
  .handler(async () => {
    const user = await getUserInRoute()

    if (!user)
      unauthorized()
  
    const accountService = getAccountService()
    
    const accounts = await accountService.getAccountsUserMemberOf(user.id)

    return accounts.map(({ id, name }) => ({ id: maskNumber(id), name } as UserAccountVm))
  })

// export const GET = async () => {
//   const user = await getUserInRoute()

//   if (!user) {
//     unauthorized()
//   }

//   const accountService = getAccountService()

//   const accounts = await accountService.getAccountsUserMemberOf(user.id)

//   return accounts.map(({ id, name }) => ({ id: maskNumber(id), name } as UserAccountVm))
// }
