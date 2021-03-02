import { zId } from "integrations/domain"
import * as z from "zod"

export const zCreateQuotation = z.object({ postId: zId })
