import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import {
  Id,
  IdFactory,
  LikeEntity,
  NotificationEntity,
  NotificationTypeFactory,
} from "core"
import {
  LikeRepository,
  NotificationRepository,
  PostRepository,
} from "infrastructure"
import { InternalError } from "integrations/errors"

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

      if (post instanceof Error) {
        return new InternalError()
      }

      if (post === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      const draftLike = new LikeEntity({
        id: IdFactory.nanoid(),
        postId: props.postId,
        userId: props.userId,
      })

      const transaction = await this.likeRepository.upsert(draftLike)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      const draftNotification = new NotificationEntity({
        friendshipId: null,
        id: IdFactory.nanoid(),
        isRead: false,
        likeId: draftLike.id,
        postId: props.postId,
        relatedUserId: props.userId,
        type: NotificationTypeFactory.like(),
        userId: post.userId,
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
