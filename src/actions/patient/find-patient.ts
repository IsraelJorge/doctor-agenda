'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { GuardService } from '@/services/guard-service'

export const findPatient = async () => {
  const session = await GuardService.getValidatedSession({
    requireClinic: true,
  })

  const patients = await db.query.patientTable.findMany({
    where: eq(doctorTable.clinicId, session.user.clinic.id),
  })

  return patients
}
