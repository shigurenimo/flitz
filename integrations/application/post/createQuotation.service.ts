import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import {
  Id,
  IdFactory,
  NotificationEntity,
  NotificationType,
  PostEntity,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  FriendshipRepository,
  NotificationRepository,
  PostRepository,
} from "integrations/infrastructure"

type Props = {
  userId: Id
  postId: Id
}

export class CreateQuotationService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(props: Props) {
    try {
      const post = await this.postRepository.find(props.postId)

      if (post === null) {
        throw new NotFoundError()
      }

      const friendShips = await this.friendshipRepository.findManyByFolloweeId(
        props.userId
      )

      const quotation = new PostEntity({
        fileIds: [],
        id: IdFactory.nanoid(),
        quotationId: post.id,
        quotationsCount: 0,
        repliesCount: 0,
        replyId: null,
        text: null,
        userId: props.userId,
        followerIds: friendShips.map((entity) => {
          return entity.followerId
        }),
      })

      await this.postRepository.upsert(quotation)

      const notification = new NotificationEntity({
        friendshipId: null,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: null,
        postId: quotation.id,
        relatedUserId: props.userId,
        type: new NotificationType("QUOTATION"),
        userId: post.userId,
      })

      await this.notificationRepository.upsert(notification)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
