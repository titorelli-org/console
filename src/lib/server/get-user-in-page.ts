import { cookies } from "next/headers"
import { sessionTokenCookieName } from "@/constants"
import { getUserSessionService } from "./services/instances"
import { isTokenVerified } from "./get-is-authenticated"

export const getUserInPage = async () => {
  const userSessionService = getUserSessionService()
  const c = await cookies()
  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (await isTokenVerified(sessionToken)) {
    return userSessionService.getUserBySessionToken(sessionToken!)
  }

  return null
}
