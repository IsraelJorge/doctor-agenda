import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { customSession } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { db } from '@/database'
import * as schemas from '@/database/schemas'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schemas,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ session, user }) => {
      const [clinic] = await db.query.usersToClinicsTable.findMany({
        where: eq(schemas.usersToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      })
      return {
        ...session,
        user: {
          ...user,
          clinic: clinic ? clinic.clinic : null,
        },
      }
    }),
  ],
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
