import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { findAvailableTimes } from '@/actions/find-available-times'
import { DateHelpers } from '@/helpers/date-helpers'

type AvailableTimes = Awaited<ReturnType<typeof findAvailableTimes>>

type Params = {
  options?: UseQueryOptions<AvailableTimes>
  data: {
    date?: Date
    doctorId?: string
  }
}

export const useFindAvailableTimes = ({ data, options }: Params) => {
  return useQuery<AvailableTimes>({
    ...options,
    queryKey: ['find-available-times', data.date, data.doctorId],
    queryFn: async () =>
      await findAvailableTimes({
        date: DateHelpers.format({
          date: data.date ?? '',
          format: 'YYYY-MM-DD',
        }),
        doctorId: data.doctorId ?? '',
      }),
    enabled: !!data.date && !!data.doctorId,
  })
}
