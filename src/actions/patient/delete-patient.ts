'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/database'
import { patientTable } from '@/database/schemas/patient'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { z } from '@/lib/zod'
import { Route } from '@/utils/routes'

export const deletePatient = actionClient
  .inputSchema(
    z.object({
      id: z.uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const patient = await db.query.patientTable.findFirst({
      where: eq(patientTable.id, parsedInput.id),
    })

    if (!patient) throw new Error('Patient not found')
    if (patient.clinicId !== session.user.clinic?.id)
      throw new Error('Unauthorized')

    await db.delete(patientTable).where(eq(patientTable.id, parsedInput.id))
    revalidatePath(Route.patient)
  })
