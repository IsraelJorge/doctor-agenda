'use server'

import { and, eq, sql } from 'drizzle-orm'

import { ErrorUtils } from '@/data/erros'
import { db } from '@/database'
import { appointmentTable, doctorTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'
import { generateTimeSlots } from '@/helpers/time'
import { actionClient } from '@/lib/safe-action'
import { z } from '@/lib/zod'
import { GuardService } from '@/services/guard-service'

export const findAvailableTimes = actionClient
  .inputSchema(
    z.object({
      doctorId: z.string(),
      date: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    await GuardService.getValidatedSession({
      requireClinic: true,
    })

    const doctor = await db.query.doctorTable.findFirst({
      where: eq(doctorTable.id, parsedInput.doctorId),
    })

    if (!doctor) {
      return ErrorUtils.notFound({
        message: 'Doctor not found',
      })
    }

    const selectedDayOfWeek = DateHelpers.getDay(parsedInput.date)

    const doctorAvailable =
      doctor.availableFromWeekDay <= selectedDayOfWeek &&
      doctor.availableToWeekDay >= selectedDayOfWeek

    if (!doctorAvailable) return []

    const appointments = await db.query.appointmentTable.findMany({
      where: and(
        eq(appointmentTable.doctorId, parsedInput.doctorId),
        sql`DATE(${appointmentTable.date}) = ${parsedInput.date}`,
      ),
    })

    const appointmentsOnSelectedDate = appointments.map((appointment) =>
      DateHelpers.format({ date: appointment.date, format: 'HH:mm:ss' }),
    )

    const timeSlots = generateTimeSlots()

    const doctorAvailableFrom = DateHelpers.timeStringToLocalDate(
      doctor.availableFromTime,
    )

    const doctorAvailableTo = DateHelpers.timeStringToLocalDate(
      doctor.availableToTime,
    )

    const doctorTimeSlots = timeSlots.filter((timeSlot) => {
      const [hour, minutes] = timeSlot.split(':')

      const date = DateHelpers.getDateUTC()
        .set('hour', Number(hour))
        .set('minute', Number(minutes))
        .set('second', 0)

      return (
        date.format('HH:mm:ss') >= doctorAvailableFrom.format('HH:mm:ss') &&
        date.format('HH:mm:ss') <= doctorAvailableTo.format('HH:mm:ss')
      )
    })

    return doctorTimeSlots.map((timeSlot) => ({
      value: timeSlot,
      available: !appointmentsOnSelectedDate.includes(timeSlot),
      label: timeSlot.substring(0, 5),
    }))
  })
