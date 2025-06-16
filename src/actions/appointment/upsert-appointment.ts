'use server'

import { revalidatePath } from 'next/cache'

import { ErrorUtils } from '@/data/erros'
import { AppointmentFormSchema } from '@/data/schemas/appointment'
import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { actionClient } from '@/lib/safe-action'
import { GuardService } from '@/services/guard-service'
import { Route } from '@/utils/routes'

import { findAvailableTimes } from './find-available-times'

export const upsertAppointment = actionClient
  .inputSchema(AppointmentFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await GuardService.getValidatedSession({
      requireClinic: true,
    })

    const date = new Date(parsedInput.date)
    const dateWithTimeUTC = DateHelpers.setHoursDate(date, parsedInput.time)

    const availableTimes = await findAvailableTimes({
      date: DateHelpers.format({
        date: dateWithTimeUTC,
        format: 'YYYY-MM-DD',
      }),
      doctorId: parsedInput.doctorId,
    })

    if (!availableTimes?.data) {
      return ErrorUtils.validationError({
        message: 'Time is not available',
      })
    }

    const isTimeAvailable = availableTimes.data.some(
      (time) => time.value === parsedInput.time && time.available,
    )

    if (!isTimeAvailable) {
      return ErrorUtils.validationError({
        message: 'Time is not available',
      })
    }

    await db
      .insert(appointmentTable)
      .values({
        ...parsedInput,
        date: dateWithTimeUTC,
        appointmentPriceInCents: parsedInput.appointmentPrice * 100,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [appointmentTable.id],
        set: {
          ...parsedInput,
          date: dateWithTimeUTC,
          appointmentPriceInCents: parsedInput.appointmentPrice * 100,
        },
      })

    revalidatePath(Route.appointment)
    revalidatePath(Route.dashboard)
  })
