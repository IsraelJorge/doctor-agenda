'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'

export const findAppointment = async () => {
  const session = await getUserSession()
  if (!session) throw new Error('Unauthorized')
  if (!session.user.clinic?.id) throw Error('Not found clinic')

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
