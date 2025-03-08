'use server'

import { getUserInPage } from "@/lib/server/get-user-in-page"
import { maskNumber } from "@/lib/server/keymask"
import { HeaderUserVm } from "@/types/header"

export const getUserInHeader = async () => {
  const user = await getUserInPage()

  if (!user)
    return null

  return {
    id: maskNumber(user.id),
    username: 'ychebotaev',
    email: 'hello@world.com',
  } as HeaderUserVm
}
