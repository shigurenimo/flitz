import { z } from "zod"

export const zCreatePostMutation = z.object({
  fileId: z.string().nullable(),
  text: z.string(),
})
