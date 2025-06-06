'use server'

import { revalidatePath } from 'next/cache'

import { DoctorFormSchema } from '@/data/schemas/doctor'
import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { Route } from '@/utils/routes'

export const upsertDoctor = actionClient
  .inputSchema(DoctorFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')
    if (!session.user.clinic?.id) throw Error('Not found clinic')

    const availableFromTimeUTC = DateHelpers.convertHoursToUTC(
      parsedInput.availableFromTime,
    )
    const availableToTimeUTC = DateHelpers.convertHoursToUTC(
      parsedInput.availableToTime,
    )

    await db
      .insert(doctorTable)
      .values({
        ...parsedInput,
        appointmentPriceInCents: parsedInput.appointmentPrice * 100,
        clinicId: session.user.clinic.id,
        availableFromTime: availableFromTimeUTC,
        availableToTime: availableToTimeUTC,
      })
      .onConflictDoUpdate({
        target: [doctorTable.id],
        set: {
          ...parsedInput,
          availableFromTime: availableFromTimeUTC,
          availableToTime: availableToTimeUTC,
          appointmentPriceInCents: parsedInput.appointmentPrice * 100,
        },
      })

    revalidatePath(Route.doctor)
  })
