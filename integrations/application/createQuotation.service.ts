import { NotFoundError } from "blitz"
import {
  Count,
  FriendshipRepository,
  Id,
  IdFactory,
  NotificationEntity,
  NotificationRepository,
  NotificationType,
  PostEntity,
  PostRepository,
} from "integrations/domain"

export class CreateQuotationService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async call(input: { userId: Id; postId: Id }) {
    const postEntity = await this.postRepository.find(input.postId)

    if (postEntity === null) {
      throw new NotFoundError()
    }

    const friendShipEntities = await this.friendshipRepository.findManyByFolloweeId(
      input.userId
    )

    const quotationEntity = new PostEntity({
      fileIds: [],
      id: IdFactory.create(),
      quotationId: postEntity.id,
      quotationsCount: new Count(0),
      repliesCount: new Count(0),
      replyId: null,
      text: null,
      userId: input.userId,
      followerIds: friendShipEntities.map((entity) => {
        return entity.followerId
      }),
    })

    await this.postRepository.upsert(quotationEntity)

    const notificationEntity = new NotificationEntity({
      friendshipId: null,
      id: IdFactory.create(),
      isRead: false,
      likeId: null,
      postId: quotationEntity.id,
      relatedUserId: input.userId,
      type: new NotificationType("QUOTATION"),
      userId: postEntity.userId,
    })

    await this.notificationRepository.upsert(notificationEntity)
  }
}
