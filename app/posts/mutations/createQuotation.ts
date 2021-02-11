import { resolver } from "blitz"
import { Id, idSchema } from "integrations/domain/valueObjects"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "integrations/infrastructure/repositories"
import * as z from "zod"

const CreateQuotation = z.object({ postId: idSchema })

export default resolver.pipe(
  resolver.zod(CreateQuotation),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async ({ postId, userId }) => {
    const friendshipRepository = new FriendshipRepository()

    const { friendships } = await friendshipRepository.getUserFollowers({
      followeeId: userId,
    })

    const postRepository = new PostRepository()

    const { post, postEntity } = await postRepository.createPostQuotation({
      friendships,
      postId,
      userId,
    })

    const [quotationEntity] = postEntity.quotations

    const notificationRepository = new NotificationRepository()

    await notificationRepository.upsertQuotationNotification({
      postUserId: postEntity.userId,
      quotationId: quotationEntity.id,
      postId,
    })

    return post
  }
)
