import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

export default async function PublicLayout({ children }: PropsWithChildren) {
  const session = await getUserSession()

  if (session) {
    redirect(Route.dashboard)
  }

  return <>{children}</>
}
