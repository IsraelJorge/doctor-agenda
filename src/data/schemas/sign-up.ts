import { z } from '@/lib/zod'

export const SignUpFormSchema = z.object({
  name: z.string().trim().min(1),
  password: z.string().trim().min(8),
  email: z.email().trim(),
})

export type SignUpForm = z.infer<typeof SignUpFormSchema>
