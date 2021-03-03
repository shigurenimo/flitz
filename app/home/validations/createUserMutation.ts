import * as z from "zod"

export const zCreateUserMutation = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
})
