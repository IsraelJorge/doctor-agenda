'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { ErrorUtils } from '@/data/erros'
import { IdSchema } from '@/data/schemas/shared'
import { db } from '@/database'
import { patientTable } from '@/database/schemas/patient'
import { actionClient } from '@/lib/safe-action'
import { GuardService } from '@/services/guard-service'
import { Route } from '@/utils/routes'

export const deletePatient = actionClient
  .inputSchema(IdSchema)
  .action(async ({ parsedInput }) => {
    const session = await GuardService.getValidatedSession({
      requireClinic: true,
    })

    const patient = await db.query.patientTable.findFirst({
      where: eq(patientTable.id, parsedInput.id),
    })

    if (!patient) {
      return ErrorUtils.notFound({
        message: 'Patient not found',
      })
    }

    if (patient.clinicId !== session.user.clinic.id) {
      return ErrorUtils.unauthorized({
        message: 'You are not authorized to delete this patient',
      })
    }

    await db.delete(patientTable).where(eq(patientTable.id, parsedInput.id))
    revalidatePath(Route.patient)
  })
