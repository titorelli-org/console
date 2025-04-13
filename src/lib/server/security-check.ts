import { forbidden } from "next/navigation"
import { getSecurityService } from "./services/instances"

export const securityCheck = async <Args extends unknown[]>(securityMemberFn: (...args: Args) => Promise<boolean>, ...args: Args) => {
  const securityService = getSecurityService()

  const pass = securityMemberFn.apply(securityService, args)

  if (!pass)
    forbidden()

  return true
}
