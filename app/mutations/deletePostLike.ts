import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zDeletePostLikeMutation } from "interface/posts/validations/deletePostLikeMutation"
import { DeletePostLikeService } from "service/post/deletePostLike.service"

const deletePostLike = resolver.pipe(
  resolver.zod(zDeletePostLikeMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      postId: new Id(props.postId),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const service = container.resolve(DeletePostLikeService)

    const result = await service.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(deletePostLike, "deletePostLike")
