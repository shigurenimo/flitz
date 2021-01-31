import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ postId: idSchema })

const createQuotation = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const postId = new Id(input.postId)

  const userId = new Id(ctx.session.userId)

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

export default createQuotation
