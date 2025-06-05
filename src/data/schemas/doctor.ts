import { z } from '@/lib/zod'

export const DoctorFormSchema = z
  .object({
    name: z.string().trim().min(3),
    specialty: z.string().trim().min(3),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string(),
    availableToTime: z.string(),
    appointmentPrice: z.number().min(0),
    clinicId: z.string(),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime
    },
    {
      error: 'O horário de início deve ser anterior ao horário de término',
      path: ['availableToTime'],
    },
  )

export type DoctorForm = z.infer<typeof DoctorFormSchema>
