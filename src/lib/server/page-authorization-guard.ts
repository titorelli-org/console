import { cookies } from "next/headers"
import { sessionTokenCookieName } from "@/constants"
import { UserSessionService } from "@/lib/server/services/user-session-service"

export const pageAuthorizationGuard = async () => {
  const userSessionService = new UserSessionService()
  const c = await cookies()

  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (!sessionToken)
    throw new Error('Can\'t access page without authorization')

  if (!await userSessionService.verifySessionToken(sessionToken))
    throw new Error('Token invalid')

  const user = await userSessionService.getUserBySessionToken(sessionToken)

  if (!user)
    throw new Error('Such user not authorized')
}
