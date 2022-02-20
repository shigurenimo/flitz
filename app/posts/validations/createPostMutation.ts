import { z } from "zod"

export const zCreatePostMutation = z.object({
  // base64 workaround. see onCreatePost in HomePageInput
  image: z.string().nullable(),
  text: z.string(),
})
