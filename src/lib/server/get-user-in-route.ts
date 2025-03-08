import { cookies } from "next/headers"
import { sessionTokenCookieName } from "@/constants"
import { isTokenVerified } from "./get-is-authenticated"
import { getUserSessionService } from "./services/instances"

export const getUserInRoute = async () => {
  const userSessionService = getUserSessionService()

  const c = await cookies()
  const sessionToken = c.get(sessionTokenCookieName)?.value ?? null

  if (!sessionToken)
    return null

  if (await isTokenVerified(sessionToken)) {
    return userSessionService.getUserBySessionToken(sessionToken!)
  }

  return null
}
