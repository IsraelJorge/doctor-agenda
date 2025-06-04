import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/database'
import { usersToClinicsTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'
import { Route } from '@/utils/routes'

export default async function DashboardPage() {
  const session = await getUserSession()

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session!.user.id),
  })

  if (clinics.length === 0) redirect(Route.clinicForm)

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
