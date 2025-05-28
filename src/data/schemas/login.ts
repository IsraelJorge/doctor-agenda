import { z } from '@/lib/zod'

export const LoginFormSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(8),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
