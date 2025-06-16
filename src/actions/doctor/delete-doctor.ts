'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/database'
import { doctorTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { z } from '@/lib/zod'
import { Route } from '@/utils/routes'

export const deleteDoctor = actionClient
  .inputSchema(
    z.object({
      id: z.uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const doctor = await db.query.doctorTable.findFirst({
      where: eq(doctorTable.id, parsedInput.id),
    })

    if (!doctor) throw new Error('Doctor not found')
    if (doctor.clinicId !== session.user.clinic?.id)
      throw new Error('Unauthorized')

    await db.delete(doctorTable).where(eq(doctorTable.id, parsedInput.id))
    revalidatePath(Route.doctor)
  })
