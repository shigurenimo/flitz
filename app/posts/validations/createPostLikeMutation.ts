import { zId } from "integrations/domain"
import * as z from "zod"

export const zCreatePostLikeMutation = z.object({ postId: zId })
