import 'dayjs/locale/pt-br'

import dayjs, { OpUnitType } from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.locale('pt-br')

export const DateHelpers = {
  format: ({ date, format }: { date: Date | string; format: string }) => {
    return dayjs(date).format(format)
  },
  convertHoursToUTC: (hours: string) => {
    const [hour, minutes, seconds] = hours.split(':')

    const hoursUTC = dayjs()
      .set('hour', parseInt(hour))
      .set('minute', parseInt(minutes))
      .set('second', parseInt(seconds))
      .utc()
      .format('HH:mm:ss')

    return hoursUTC
  },
  getWeekAndTimeAvailability: ({
    availableFromWeekDay,
    availableToWeekDay,
    availableFromTime,
    availableToTime,
  }: {
    availableFromWeekDay: number
    availableToWeekDay: number
    availableFromTime: string
    availableToTime: string
  }) => {
    const [hourFrom, minutesFrom, secondsFrom] = availableFromTime.split(':')
    const [hourTo, minutesTo, secondsTo] = availableToTime.split(':')

    const from = dayjs()
      .utc()
      .day(availableFromWeekDay)
      .set('hour', Number(hourFrom))
      .set('minute', Number(minutesFrom))
      .set('second', Number(secondsFrom))
      .local()

    const to = dayjs()
      .utc()
      .day(availableToWeekDay)
      .set('hour', Number(hourTo))
      .set('minute', Number(minutesTo))
      .set('second', Number(secondsTo))
      .local()

    return {
      from,
      to,
    }
  },
  setHoursDate: (date: Date, hours: string) => {
    const [hour, minutes, seconds] = hours.split(':')

    const newDate = dayjs(date)
      .set('hour', parseInt(hour))
      .set('minute', parseInt(minutes))
      .set('second', parseInt(seconds))
      .utc()
      .toDate()

    return newDate
  },
  formatDateWithTime(date: Date) {
    return dayjs(date).local().format('DD/MM/YYYY [às] HH:mm')
  },
  isSame: ({
    date,
    current,
    type,
  }: {
    date: Date
    current: Date
    type: OpUnitType
  }) => {
    return dayjs(date).isSame(current, type)
  },
  getDateUTC: (date?: Date | string) => {
    return dayjs(date).utc()
  },
  timeStringToLocalDate: (time: string) => {
    const [hour, minutes] = time.split(':')

    return dayjs()
      .utc()
      .set('hour', Number(hour))
      .set('minute', Number(minutes))
      .set('second', 0)
      .local()
  },
  getDay: (date: Date | string) => {
    return dayjs(date).day()
  },
}
