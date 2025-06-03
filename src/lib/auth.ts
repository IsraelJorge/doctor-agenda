import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'

import { db } from '@/database'
import * as schemas from '@/database/schemas'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schemas,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  user: {
    modelName: 'userTable',
  },
  session: {
    modelName: 'sessionTable',
  },
  account: {
    modelName: 'accountTable',
  },
  verification: {
    modelName: 'verificationTable',
  },
})

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}
