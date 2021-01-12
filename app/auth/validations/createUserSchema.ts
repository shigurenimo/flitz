import * as z from "zod"

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(100),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
