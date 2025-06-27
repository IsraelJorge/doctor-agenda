import { z } from '@/lib/zod'

export const IdSchema = z.object({
  id: z.uuid(),
})
