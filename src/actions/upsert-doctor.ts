'use server'

import { DoctorFormSchema } from '@/data/schemas/doctor'
import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'

export const upsertDoctor = actionClient
  .inputSchema(DoctorFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')
    if (!session.user.clinic?.id) throw Error('Not found clinic')

    await db
      .insert(doctorTable)
      .values({
        ...parsedInput,
        appointmentPriceInCents: parsedInput.appointmentPrice * 100,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [doctorTable.id],
        set: {
          ...parsedInput,
        },
      })
  })
