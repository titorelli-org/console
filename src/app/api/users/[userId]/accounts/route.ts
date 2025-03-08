import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber } from "@/lib/server/keymask"
import { UserAccountVm } from "@/types/header"
import { getAccountService } from "@/lib/server/services/instances"
import { unauthorized } from "next/navigation"
import { createZodRoute } from "next-zod-route"

export const GET = createZodRoute()
  .handler(async () => {
    console.log(10)

    const user = await getUserInRoute()

    console.log(12, 'user =', user)

    if (!user)
      unauthorized()

    console.log(19)
  
    const accountService = getAccountService()
    
    console.log(23)
  
    const accounts = await accountService.getAccountsUserMemberOf(user.id)

    console.log(27)
  
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
