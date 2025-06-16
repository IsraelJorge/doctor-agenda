'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { GuardService } from '@/services/guard-service'

export const findDoctor = async () => {
  const session = await GuardService.getValidatedSession({
    requireClinic: true,
  })

  const doctors = await db.query.doctorTable.findMany({
    where: eq(doctorTable.clinicId, session.user.clinic.id),
  })

  return doctors
}
