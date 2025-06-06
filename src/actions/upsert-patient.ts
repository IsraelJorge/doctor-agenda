'use server'

import { revalidatePath } from 'next/cache'

import { PatientFormSchema } from '@/data/schemas/patient'
import { db } from '@/database'
import { patientTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { Route } from '@/utils/routes'

export const upsertPatient = actionClient
  .inputSchema(PatientFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')
    if (!session.user.clinic?.id) throw Error('Not found clinic')

    await db
      .insert(patientTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [patientTable.id],
        set: {
          ...parsedInput,
        },
      })

    revalidatePath(Route.patient)
  })
