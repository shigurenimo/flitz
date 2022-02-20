import { withSentry } from "app/core/utils/withSentry"
import { NotFoundError, resolver } from "blitz"
import { FindPostQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  id: z.string(),
})

const getPost = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      id: new Id(props.id),
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findPostQuery = container.resolve(FindPostQuery)

    const post = await findPostQuery.execute({
      postId: props.id,
      userId: props.userId,
    })

    if (post === null) {
      throw new NotFoundError()
    }

    return post
  }
)

export default withSentry(getPost, "getPost")
