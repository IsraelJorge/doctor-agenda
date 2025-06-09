'use server'

import { revalidatePath } from 'next/cache'

import { AppointmentFormSchema } from '@/data/schemas/appointment'
import { db } from '@/database'
import { appointmentTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { Route } from '@/utils/routes'

export const upsertAppointment = actionClient
  .inputSchema(AppointmentFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')
    if (!session.user.clinic?.id) throw Error('Not found clinic')

    const date = new Date(parsedInput.date)
    const dateWithTimeUTC = DateHelpers.setHoursDate(date, parsedInput.time)

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
  })
