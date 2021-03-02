import { zPostText } from "integrations/domain"
import * as z from "zod"

export const zCreatePostMutation = z.object({
  // base64 workaround. see onCreatePost in HomePageInput
  image: z.string().nullable(),
  text: zPostText,
})
