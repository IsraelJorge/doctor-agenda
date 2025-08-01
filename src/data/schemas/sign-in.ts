import { z } from '@/lib/zod'

export const SignInFormSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(8),
})

export type SignInForm = z.infer<typeof SignInFormSchema>
