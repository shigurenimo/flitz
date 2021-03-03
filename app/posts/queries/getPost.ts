import { NotFoundError, resolver } from "blitz"
import { Id, zId } from "integrations/domain"
import { PostQuery } from "integrations/infrastructure/queries/post.query"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetPost = z.object({ id: zId })

export default resolver.pipe(
  resolver.zod(GetPost),
  (input, ctx) => ({
    id: new Id(input.id),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    const post = await app.get(PostQuery).find(input.id, input.userId)

    if (!post) {
      throw new NotFoundError()
    }

    return post
  }
)
