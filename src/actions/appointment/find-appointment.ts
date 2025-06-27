'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { GuardService } from '@/services/guard-service'

export const findAppointment = async () => {
  const session = await GuardService.getValidatedSession({
    requireClinic: true,
  })

  const appointments = await db.query.appointmentTable.findMany({
    where: eq(appointmentTable.clinicId, session.user.clinic.id),
    with: {
      doctor: true,
      patient: true,
    },
    orderBy: (appointment, { desc }) => [desc(appointment.createdAt)],
  })

  return appointments
}
