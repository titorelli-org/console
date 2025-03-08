import { unauthorized } from "next/navigation"
import { z } from "zod"
import { createZodRoute } from 'next-zod-route'
import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { getAccountService } from "@/lib/server/services/instances"
import type { UserAccountVm } from "@/types/header"

export const GET = createZodRoute()
  .params(
    z.object({
      accountId: z.string()
    })
  )
  .handler(async (_, { params }) => {
    const accountId = unmaskNumber(params.accountId)
    const user = await getUserInRoute()

    if (!user)
      unauthorized()

    if (!accountId)
      unauthorized()

    const accountService = getAccountService()
    const account = await accountService.getAccountUserMemberOf(user.id, accountId)

    if (!account)
      throw new Error(`Account not exist with given id = ${params.accountId}`)

    return {
      id: maskNumber(account.id),
      name: account.name
    } as UserAccountVm
  })

// export const GET = async (req: NextRequest, { params }: { params: Promise<{ accountId: string }> }) => {
//   const accountId = unmaskNumber((await params).accountId)
//   const accountService = getAccountService()
//   const user = await getUserInRoute()

//   if (!user) {
//     unauthorized()
//   }

//   if (!accountId) {
//     unauthorized()
//   }

//   const account = await accountService.getAccountUserMemberOf(user.id, accountId)

//   if (!account)
//     throw new Error(`Cannot find account with id = ${accountId} in user id = ${user.id} accounts list`)

//   const accountVm = { id: maskNumber(account.id), name: account.name } as UserAccountVm

//   return NextResponse.json(accountVm)
// }
