import axios from 'axios'
import { env } from '@/lib/server/env'
import { useSession } from './use-session'
import { sessionTokenCookieName } from '@/constants'

const client = axios.create({ baseURL: env.SITE_ORIGIN ?? '/' })

export const useApiClient = () => {
  const session = useSession()

  if (session) {
    client.defaults.headers.common['Cookie'] = `${sessionTokenCookieName}=${session}`
  } else {
    delete client.defaults.headers.common['Cookie']
  }

  return client
}
