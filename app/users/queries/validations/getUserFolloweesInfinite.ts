import { Ctx } from "blitz"
import {
  Id,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "integrations/domain"
import * as z from "zod"

export const zGetUserFolloweesInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export const resolveGetUserFolloweesInfinite = (
  input: z.infer<typeof zGetUserFolloweesInfinite>,
  ctx: Ctx
) => ({
  skip: new Skip(input.skip),
  take: new Take(),
  userId: Id.nullable(ctx.session.userId),
  username: new Username(input.username),
})
