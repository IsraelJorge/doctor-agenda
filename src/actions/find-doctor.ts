'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'

export const findDoctor = async () => {
  const session = await getUserSession()
  if (!session) throw new Error('Unauthorized')
  if (!session.user.clinic?.id) throw Error('Not found clinic')

  const doctors = await db.query.doctorTable.findMany({
    where: eq(doctorTable.clinicId, session.user.clinic.id),
  })

  return doctors
}
