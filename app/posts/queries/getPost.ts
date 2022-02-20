import { NotFoundError, resolver } from "blitz"
import { PostQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetPost = z.object({ id: z.string() })

const getPost = resolver.pipe(
  resolver.zod(zGetPost),
  (props, ctx) => {
    return {
      id: new Id(props.id),
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const postQuery = container.resolve(PostQuery)

    const post = await postQuery.find(props.id, props.userId)

    if (!post) {
      throw new NotFoundError()
    }

    return post
  }
)

export default getPost
