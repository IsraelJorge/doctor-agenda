import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

export default async function Home() {
  const session = await getUserSession()

  if (!session) return redirect(Route.authentication)
  if (session) return redirect(Route.dashboard)

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main>
        <h1>Hello World</h1>
      </main>
    </div>
  )
}
