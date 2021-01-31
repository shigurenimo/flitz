import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import {
  NotificationRepository,
  PostRepository,
} from "infrastructure/repositories"
import * as z from "zod"

export const inputSchema = z.object({ postId: idSchema })

const createPostLike = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const postId = new Id(input.postId)

  const userId = new Id(ctx.session.userId)

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

export default createPostLike
