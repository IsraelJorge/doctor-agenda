import { z } from '@/lib/zod'

const SexEnum = z.enum(['male', 'female'], { error: 'Sexo inválido' })

export const PatientFormSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(3),
  email: z.email(),
  phoneNumber: z.string().min(8),
  sex: SexEnum,
})

export type PatientForm = z.infer<typeof PatientFormSchema>
