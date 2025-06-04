import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

export default async function Index() {
  const session = await getUserSession()

  if (!session) return redirect(Route.authentication)
  if (session) return redirect(Route.dashboard)

  return (
    <div>
      <h1>Index</h1>
    </div>
  )
}
