import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import {
  Id,
  IdFactory,
  NotificationEntity,
  NotificationTypeFactory,
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

@injectable()
export class CreateQuotationService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(props: Props) {
    try {
      const post = await this.postRepository.find(props.postId)

      if (post instanceof Error) {
        return new InternalError()
      }

      if (post === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      const friendships = await this.friendshipRepository.findManyByFolloweeId(
        props.userId
      )

      if (friendships instanceof Error) {
        return new InternalError()
      }

      const quotation = new PostEntity({
        fileIds: [],
        id: IdFactory.nanoid(),
        quotationId: post.id,
        quotationsCount: 0,
        repliesCount: 0,
        replyId: null,
        text: null,
        userId: props.userId,
        followerIds: friendships.map((entity) => {
          return entity.followerId
        }),
      })

      const transaction = await this.postRepository.upsert(quotation)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      const notification = new NotificationEntity({
        friendshipId: null,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: null,
        postId: quotation.id,
        relatedUserId: props.userId,
        type: NotificationTypeFactory.quotation(),
        userId: post.userId,
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
