import { z } from "zod"

export const zDeletePostLikeMutation = z.object({ postId: z.string() })
