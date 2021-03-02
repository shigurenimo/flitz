import { zId } from "integrations/domain"
import * as z from "zod"

export const zDeletePostLikeMutation = z.object({ postId: zId })
