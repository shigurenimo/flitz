import { resolver } from "blitz"
import { Id, idSchema } from "integrations/domain/valueObjects"
import {
  NotificationRepository,
  PostRepository,
} from "integrations/infrastructure/repositories"
import * as z from "zod"

export const CreatePostLike = z.object({ postId: idSchema })

export default resolver.pipe(
  resolver.zod(CreatePostLike),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async ({ postId, userId }) => {
    const postRepository = new PostRepository()

    const { post, postEntity } = await postRepository.createLikes({
      postId,
      userId,
    })

    const [likeEntity] = postEntity.likes

    const notificationRepository = new NotificationRepository()

    if (postEntity.user === null) {
      return null
    }

    await notificationRepository.upsertPostLikeNotification({
      likeId: likeEntity.id,
      postId,
      postUserId: postEntity.user.id,
      userId,
    })

    return post
  }
)
