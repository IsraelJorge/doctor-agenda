import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'

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
  const chartStartDate = DateHelpers.getInstanceDayjs()
    .subtract(10, 'days')
    .startOf('day')
    .toDate()
  const chartEndDate = DateHelpers.getInstanceDayjs()
    .add(10, 'days')
    .endOf('day')
    .toDate()

  const [
    [totalRevenue],
    [totalAppointments],
    [totalPatients],
    [totalDoctors],
    dailyAppointmentsData,
    topDoctors,
  ] = await Promise.all([
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
    db
      .select({
        date: sql<string>`DATE(${appointmentTable.date})`.as('date'),
        appointments: count(appointmentTable.id),
        revenue:
          sql<number>`COALESCE(SUM(${appointmentTable.appointmentPriceInCents}), 0)`.as(
            'revenue',
          ),
      })
      .from(appointmentTable)
      .where(
        and(
          eq(appointmentTable.clinicId, session.user.clinic.id),
          gte(appointmentTable.date, chartStartDate),
          lte(appointmentTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentTable.date})`)
      .orderBy(sql`DATE(${appointmentTable.date})`),
    db
      .select({
        id: doctorTable.id,
        name: doctorTable.name,
        avatarImageUrl: doctorTable.avatarImageUrl,
        specialty: doctorTable.specialty,
        appointments: count(appointmentTable.id),
      })
      .from(doctorTable)
      .leftJoin(
        appointmentTable,
        and(
          eq(appointmentTable.doctorId, doctorTable.id),
          gte(appointmentTable.date, fromDate),
          lte(appointmentTable.date, toDate),
        ),
      )
      .where(eq(doctorTable.clinicId, session.user.clinic.id))
      .groupBy(doctorTable.id)
      .orderBy(desc(count(appointmentTable.id)))
      .limit(10),
  ])

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    dailyAppointmentsData,
    topDoctors,
  }
}
