import { resolver } from "blitz"
import { Id, idSchema } from "integrations/domain/valueObjects"
import { PostRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const DeletePostLike = z.object({ postId: idSchema })

export default resolver.pipe(
  resolver.zod(DeletePostLike),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async ({ postId, userId }) => {
    const postRepository = new PostRepository()

    const post = await postRepository.deleteLikes({ postId, userId })

    return post
  }
)
