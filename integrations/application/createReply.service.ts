import { Injectable } from "@nestjs/common"
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
  PostText,
} from "integrations/domain"

@Injectable()
export class CreateReplyService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async call(input: { userId: Id; postId: Id; text: PostText }) {
    const postEntity = await this.postRepository.find(input.postId)

    if (postEntity === null) {
      throw new NotFoundError()
    }

    const friendShipEntities = await this.friendshipRepository.findManyByFolloweeId(
      input.userId
    )

    const replyEntity = new PostEntity({
      fileIds: [],
      id: IdFactory.create(),
      quotationId: null,
      quotationsCount: new Count(0),
      repliesCount: new Count(0),
      replyId: postEntity.id,
      text: input.text,
      userId: input.userId,
      followerIds: friendShipEntities.map((entity) => {
        return entity.followerId
      }),
    })

    await this.postRepository.upsert(replyEntity)

    const notificationEntity = new NotificationEntity({
      friendshipId: null,
      id: IdFactory.create(),
      isRead: false,
      likeId: null,
      postId: replyEntity.id,
      relatedUserId: input.userId,
      type: new NotificationType("REPLY"),
      userId: postEntity.userId,
    })

    await this.notificationRepository.upsert(notificationEntity)
  }
}
