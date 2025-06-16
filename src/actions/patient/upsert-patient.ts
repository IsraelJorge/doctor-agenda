'use server'

import { revalidatePath } from 'next/cache'

import { PatientFormSchema } from '@/data/schemas/patient'
import { db } from '@/database'
import { patientTable } from '@/database/schemas'
import { actionClient } from '@/lib/safe-action'
import { GuardService } from '@/services/guard-service'
import { Route } from '@/utils/routes'

export const upsertPatient = actionClient
  .inputSchema(PatientFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await GuardService.getValidatedSession({
      requireClinic: true,
    })

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
