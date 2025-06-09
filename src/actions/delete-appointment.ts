'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { z } from '@/lib/zod'
import { Route } from '@/utils/routes'

export const deleteAppointment = actionClient
  .inputSchema(
    z.object({
      id: z.uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const appointment = await db.query.appointmentTable.findFirst({
      where: eq(appointmentTable.id, parsedInput.id),
    })

    if (!appointment) throw new Error('Appointment not found')
    if (appointment.clinicId !== session.user.clinic?.id)
      throw new Error('Unauthorized')

    await db
      .delete(appointmentTable)
      .where(eq(appointmentTable.id, parsedInput.id))
    revalidatePath(Route.appointment)
  })
