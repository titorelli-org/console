import { unauthorized } from "next/navigation"
import { getSecurityService } from "./services/instances"

export const securityCheck = async <Args extends unknown[]>(unboundFn: (...args: Args) => Promise<boolean>, ...args: Args) => {
  const securityService = getSecurityService()

  const pass = unboundFn.apply(securityService, args)

  if (!pass)
    unauthorized()

  return true
}
