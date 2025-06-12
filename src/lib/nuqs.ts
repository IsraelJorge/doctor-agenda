import { createParser } from 'nuqs'

import { DateHelpers } from '@/helpers/date-helpers'

export const parseAsIsoDate = createParser({
  parse(queryValue) {
    const date = DateHelpers.getInstanceDayjs(queryValue).toDate()
    return isNaN(date.getTime()) ? null : date
  },
  serialize(value) {
    return DateHelpers.format({
      date: value,
      format: 'YYYY-MM-DD',
    })
  },
})
