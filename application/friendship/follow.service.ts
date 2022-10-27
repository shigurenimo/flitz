import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import {
  FriendshipEntity,
  Id,
  IdFactory,
  NotificationEntity,
  NotificationTypeFactory,
} from "core"
import { FriendshipRepository, NotificationRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  followeeId: Id
  followerId: Id
}

@injectable()
export class FollowService {
  constructor(
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(props: Props) {
    try {
      if (props.followerId.value === props.followeeId.value) {
        return new InternalError("自分自身をフォローすることは出来ません。")
      }

      const friendship = new FriendshipEntity({
        followeeId: props.followeeId,
        followerId: props.followerId,
        id: IdFactory.nanoid(),
      })

      const transaction = await this.friendshipRepository.follow(friendship)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      const notification = new NotificationEntity({
        friendshipId: friendship.id,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: null,
        postId: null,
        relatedUserId: props.followerId,
        type: NotificationTypeFactory.friendship(),
        userId: props.followeeId,
      })

      /**
       * 失敗しても例外は返さない
       */
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
