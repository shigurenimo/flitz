import { captureException } from "@sentry/node"
import {
  FriendshipEntity,
  Id,
  IdFactory,
  NotificationEntity,
  NotificationType,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  FriendshipRepository,
  NotificationRepository,
} from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  followeeId: Id
  followerId: Id
}

@injectable()
export class FollowUserService {
  constructor(
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(props: Props) {
    try {
      if (props.followerId.value === props.followeeId.value) {
        throw new Error("Unexpected error")
      }

      const friendship = new FriendshipEntity({
        followeeId: props.followeeId,
        followerId: props.followerId,
        id: IdFactory.nanoid(),
      })

      await this.friendshipRepository.follow(friendship)

      const notification = new NotificationEntity({
        friendshipId: friendship.id,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: null,
        postId: null,
        relatedUserId: props.followerId,
        type: new NotificationType("FRIENDSHIP"),
        userId: props.followeeId,
      })

      await this.notificationRepository.upsert(notification)

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
