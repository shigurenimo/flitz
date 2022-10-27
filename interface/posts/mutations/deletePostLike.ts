import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { DeletePostLikeService } from "application/post/deletePostLike.service"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zDeletePostLikeMutation } from "interface/posts/validations/deletePostLikeMutation"

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
    const deletePostLikeService = container.resolve(DeletePostLikeService)

    const transaction = await deletePostLikeService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(deletePostLike, "deletePostLike")
