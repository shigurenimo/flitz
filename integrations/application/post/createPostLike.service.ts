import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import {
  Id,
  IdFactory,
  LikeEntity,
  NotificationEntity,
  NotificationType,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  LikeRepository,
  NotificationRepository,
  PostRepository,
} from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  postId: Id
  userId: Id
}

@injectable()
export class CreatePostLikeService {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(props: Props) {
    try {
      const post = await this.postRepository.find(props.postId)

      if (post === null) {
        throw new NotFoundError()
      }

      const like = new LikeEntity({
        id: IdFactory.nanoid(),
        postId: props.postId,
        userId: props.userId,
      })

      await this.likeRepository.upsert(like)

      const notification = new NotificationEntity({
        friendshipId: null,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: like.id,
        postId: props.postId,
        relatedUserId: props.userId,
        type: new NotificationType("LIKE"),
        userId: post.userId,
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
