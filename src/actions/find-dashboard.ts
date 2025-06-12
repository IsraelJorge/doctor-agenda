import { and, count, eq, gte, lte, sum } from 'drizzle-orm'

import { db } from '@/database'
import { appointmentTable, doctorTable, patientTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { getUserSession } from '@/lib/auth'

type Params = {
  from: string
  to: string
}

export const findDashboard = async ({ from, to }: Params) => {
  const session = await getUserSession()
  if (!session) throw new Error('Unauthorized')
  if (!session.user.clinic?.id) throw Error('Not found clinic')

  const fromDate = DateHelpers.getInstanceDayjs(from)
    .utc()
    .startOf('day')
    .toDate()
  const toDate = DateHelpers.getInstanceDayjs(to).utc().endOf('day').toDate()

  const [[totalRevenue], [totalAppointments], [totalPatients], [totalDoctors]] =
    await Promise.all([
      db
        .select({
          total: sum(appointmentTable.appointmentPriceInCents),
        })
        .from(appointmentTable)
        .where(
          and(
            eq(appointmentTable.clinicId, session.user.clinic.id),
            gte(appointmentTable.date, fromDate),
            lte(appointmentTable.date, toDate),
          ),
        ),
      db
        .select({
          total: count(),
        })
        .from(appointmentTable)
        .where(
          and(
            eq(appointmentTable.clinicId, session.user.clinic.id),
            gte(appointmentTable.date, fromDate),
            lte(appointmentTable.date, toDate),
          ),
        ),
      db
        .select({
          total: count(),
        })
        .from(patientTable)
        .where(eq(patientTable.clinicId, session.user.clinic.id)),
      db
        .select({
          total: count(),
        })
        .from(doctorTable)
        .where(eq(doctorTable.clinicId, session.user.clinic.id)),
    ])

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
  }
}
