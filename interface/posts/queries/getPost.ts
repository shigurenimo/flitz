import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindPostQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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

    if (post instanceof Error) {
      throw post
    }

    return post
  }
)

export default withSentry(getPost, "getPost")
