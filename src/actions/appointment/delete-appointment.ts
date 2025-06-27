'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { ErrorUtils } from '@/data/erros'
import { IdSchema } from '@/data/schemas/shared'
import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { actionClient } from '@/lib/safe-action'
import { GuardService } from '@/services/guard-service'
import { Route } from '@/utils/routes'

export const deleteAppointment = actionClient
  .inputSchema(IdSchema)
  .action(async ({ parsedInput }) => {
    const session = await GuardService.getValidatedSession({
      requireClinic: true,
    })

    const appointment = await db.query.appointmentTable.findFirst({
      where: eq(appointmentTable.id, parsedInput.id),
    })

    if (!appointment) {
      return ErrorUtils.notFound({
        message: 'Appointment not found',
      })
    }

    if (appointment.clinicId !== session.user.clinic.id) {
      return ErrorUtils.unauthorized({
        message: 'You are not authorized to delete this appointment',
      })
    }

    await db
      .delete(appointmentTable)
      .where(eq(appointmentTable.id, parsedInput.id))
    revalidatePath(Route.appointment)
  })
