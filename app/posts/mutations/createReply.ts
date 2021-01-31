import { Ctx } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "domain/valueObjects"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  text: postTextSchema,
  postId: idSchema,
})

const createReply = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const text = new PostText(input.text)

  const postId = new Id(input.postId)

  const userId = new Id(ctx.session.userId)

  const friendshipRepository = new FriendshipRepository()

  const { friendships } = await friendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const postRepository = new PostRepository()

  const { post, postEntity } = await postRepository.createReply({
    friendships,
    postId,
    text,
    userId,
  })

  const [replyEntity] = postEntity.replies

  const notificationRepository = new NotificationRepository()

  await notificationRepository.createReplyNotification({
    postUserId: postEntity.userId,
    replyId: replyEntity.id,
  })

  return post
}

export default createReply
