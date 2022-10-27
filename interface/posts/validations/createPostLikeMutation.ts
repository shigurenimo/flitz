import { z } from "zod"

export const zCreatePostLikeMutation = z.object({ postId: z.string() })
