import { z } from '@/lib/zod'

export const ClinicFormSchema = z.object({
  name: z.string().trim().min(1),
})

export type ClinicForm = z.infer<typeof ClinicFormSchema>
