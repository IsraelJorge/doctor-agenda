import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'

import { db } from '@/database'
import { appointmentTable, doctorTable, patientTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { GuardService } from '@/services/guard-service'
import { mergeDoctorsAndPatientsByMonth } from '@/utils/merge-doctors-and-patients-by-month'

type Params = {
  from: string
  to: string
}

export const findDashboard = async ({ from, to }: Params) => {
  const session = await GuardService.getValidatedSession({
    requireClinic: true,
  })

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

  const chartStartDateMonth = DateHelpers.getInstanceDayjs()
    .subtract(5, 'months')
    .startOf('month')
    .toDate()
  const chartEndDateMonth = DateHelpers.getInstanceDayjs()
    .utc()
    .endOf('month')
    .toDate()

  const [
    [totalRevenue],
    [totalAppointments],
    [totalPatients],
    [totalDoctors],
    dailyAppointmentsData,
    topDoctors,
    topSpecialties,
    todayAppointments,
    doctorsByMonth,
    patientsByMonth,
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
      .limit(5),
    db
      .select({
        specialty: doctorTable.specialty,
        appointments: count(appointmentTable.id),
      })
      .from(appointmentTable)
      .innerJoin(doctorTable, eq(appointmentTable.doctorId, doctorTable.id))
      .where(
        and(
          eq(appointmentTable.clinicId, session.user.clinic.id),
          gte(appointmentTable.date, fromDate),
          lte(appointmentTable.date, toDate),
        ),
      )
      .groupBy(doctorTable.specialty)
      .orderBy(desc(count(appointmentTable.id))),
    db.query.appointmentTable.findMany({
      where: and(
        eq(appointmentTable.clinicId, session.user.clinic.id),
        gte(
          appointmentTable.date,
          DateHelpers.getInstanceDayjs().utc().startOf('day').toDate(),
        ),
        lte(
          appointmentTable.date,
          DateHelpers.getInstanceDayjs().utc().endOf('day').toDate(),
        ),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
      .select({
        month: sql<string>`DATE_TRUNC('month', ${doctorTable.createdAt})`.as(
          'month',
        ),
        total: sql<number>`COUNT(*)`.as('total'),
      })
      .from(doctorTable)
      .where(
        and(
          sql`${doctorTable.createdAt} BETWEEN ${chartStartDateMonth} AND ${chartEndDateMonth}`,
          eq(doctorTable.clinicId, session.user.clinic.id),
        ),
      )
      .groupBy(sql`DATE_TRUNC('month', ${doctorTable.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${doctorTable.createdAt})`),
    db
      .select({
        month: sql<string>`DATE_TRUNC('month', ${patientTable.createdAt})`.as(
          'month',
        ),
        total: sql<number>`COUNT(*)`.as('total'),
      })
      .from(patientTable)
      .where(
        and(
          sql`${patientTable.createdAt} BETWEEN ${chartStartDateMonth} AND ${chartEndDateMonth}`,
          eq(patientTable.clinicId, session.user.clinic.id),
        ),
      )
      .groupBy(sql`DATE_TRUNC('month', ${patientTable.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${patientTable.createdAt})`),
  ])

  const doctorsAndPatientsByMonth = mergeDoctorsAndPatientsByMonth(
    doctorsByMonth,
    patientsByMonth,
  )

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    dailyAppointmentsData,
    topDoctors,
    topSpecialties,
    todayAppointments,
    doctorsAndPatientsByMonth,
  }
}
