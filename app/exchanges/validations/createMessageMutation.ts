import { zId, zPostText } from "integrations/domain"
import * as z from "zod"

export const zCreateMessageMutation = z.object({
  text: zPostText,
  relatedUserId: zId,
})
