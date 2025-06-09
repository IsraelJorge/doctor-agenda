import { z } from '@/lib/zod'

export const AppointmentFormSchema = z.object({
  id: z.uuid().optional(),
  patientId: z.uuid(),
  doctorId: z.uuid(),
  appointmentPrice: z.number().min(0),
  date: z.date(),
  time: z.string().min(1),
})

export type AppointmentForm = z.infer<typeof AppointmentFormSchema>
