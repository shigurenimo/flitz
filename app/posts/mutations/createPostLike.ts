import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import { NotificationRepository, PostRepository } from "integrations"
import * as z from "zod"

export const inputSchema = z.object({ postId: idSchema })

const createPostLike = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const postId = new Id(input.postId)

  const userId = new Id(ctx.session.userId)

  const post = await PostRepository.createLikes({ postId, userId })

  const [like] = post.likes

  await NotificationRepository.upsertPostLikeNotification({
    likeId: new Id(like.id),
    postId,
    postUserId: new Id(post.user.id),
    userId,
  })

  return post
}

export default createPostLike
