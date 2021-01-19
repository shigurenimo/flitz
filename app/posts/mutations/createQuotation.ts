import { Ctx } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "integrations"
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

  const friendships = await FriendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const post = await PostRepository.createPostQuotation({
    friendships,
    postId,
    userId,
  })

  const [quotation] = post.quotations

  await NotificationRepository.upsertQuotationNotification({
    postUserId: new Id(post.userId),
    quotationId: new Id(quotation.id),
    postId,
  })

  return post
}

export default createQuotation
