import { Injectable } from "@nestjs/common"
import {
  FriendshipEntity,
  FriendshipRepository,
  Id,
  IdFactory,
  NotificationEntity,
  NotificationRepository,
  NotificationType,
} from "integrations/domain"

@Injectable()
export class FollowUserService {
  constructor(
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async call(input: { followeeId: Id; followerId: Id }) {
    try {
      if (input.followerId.value === input.followeeId.value) {
        throw new Error("Unexpected error")
      }

      const friendshipEntity = new FriendshipEntity({
        followeeId: input.followeeId,
        followerId: input.followerId,
        id: IdFactory.create(),
      })

      await this.friendshipRepository.follow(friendshipEntity)

      const notificationEntity = new NotificationEntity({
        friendshipId: friendshipEntity.id,
        id: IdFactory.create(),
        isRead: false,
        likeId: null,
        postId: null,
        relatedUserId: input.followerId,
        type: new NotificationType("FRIENDSHIP"),
        userId: input.followeeId,
      })

      await this.notificationRepository.upsert(notificationEntity)

      return null
    } catch (error) {
      return Error()
    }
  }
}
