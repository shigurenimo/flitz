import { resolver } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "integrations/domain"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "integrations/infrastructure"
import * as z from "zod"

const CreateReply = z.object({
  postId: idSchema,
  text: postTextSchema,
})

export default resolver.pipe(
  resolver.zod(CreateReply),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async ({ postId, text, userId }) => {
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
)
