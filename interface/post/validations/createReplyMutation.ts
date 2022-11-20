import { z } from "zod"

export const zCreateReplyMutation = z.object({
  postId: z.string(),
  text: z.string(),
})
