import { z } from '@/lib/zod'

export const RegisterFormSchema = z.object({
  name: z.string().trim().min(1),
  password: z.string().trim().min(8),
  email: z.email().trim(),
})

export type RegisterFormType = z.infer<typeof RegisterFormSchema>
