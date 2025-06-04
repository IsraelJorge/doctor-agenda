'use server'

import { ClinicForm } from '@/data/schemas/clinic'
import { db } from '@/database'
import { clinicTable, usersToClinicsTable } from '@/database/schemas'
import { getUserSession } from '@/lib/auth'

export const createClinic = async (data: ClinicForm) => {
  const session = await getUserSession()

  if (!session) throw new Error('Unauthorized')

  const [clinic] = await db
    .insert(clinicTable)
    .values({
      name: data.name,
    })
    .returning()

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  })
}
