import { z } from "zod"

export const zCreateMessageMutation = z.object({
  text: z.string(),
  relatedUserId: z.string(),
})
