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
import { InternalError } from "infrastructure/errors"

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

      const draftFriendship = new FriendshipEntity({
        followeeId: props.followeeId,
        followerId: props.followerId,
        id: IdFactory.nanoid(),
      })

      const transaction = await this.friendshipRepository.follow(
        draftFriendship
      )

      if (transaction instanceof Error) {
        return new InternalError()
      }

      const draftNotification = new NotificationEntity({
        friendshipId: draftFriendship.id,
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
      await this.notificationRepository.upsert(draftNotification)

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
