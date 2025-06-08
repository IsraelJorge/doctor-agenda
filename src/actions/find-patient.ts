'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'

export const findPatient = async () => {
  const session = await getUserSession()
  if (!session) throw new Error('Unauthorized')
  if (!session.user.clinic?.id) throw Error('Not found clinic')

  const patients = await db.query.patientTable.findMany({
    where: eq(doctorTable.clinicId, session.user.clinic.id),
  })

  return patients
}
