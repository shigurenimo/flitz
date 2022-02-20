import { z } from "zod"

export const zCreateQuotation = z.object({ postId: z.string() })
