import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const DateHelpers = {
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
}
