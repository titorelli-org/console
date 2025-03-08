import { cookies } from "next/headers"
import { UserSessionService } from '@/lib/server/services/user-session-service'
import { sessionTokenCookieName } from "@/constants"

export const getUserInAction = async () => {
  const userSessionService = new UserSessionService()
  const c = await cookies()

  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (!sessionToken)
    return null

  if (!await userSessionService.verifySessionToken(sessionToken))
    return null

  const user = await userSessionService.getUserBySessionToken(sessionToken)

  if (!user)
    return null

  return user
}
