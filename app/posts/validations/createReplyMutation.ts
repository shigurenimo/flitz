import { zId, zPostText } from "integrations/domain"
import * as z from "zod"

export const zCreateReplyMutation = z.object({
  postId: zId,
  text: zPostText,
})
