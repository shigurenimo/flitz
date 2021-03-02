import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import {
  Id,
  IdFactory,
  LikeEntity,
  LikeRepository,
  NotificationEntity,
  NotificationRepository,
  NotificationType,
  PostRepository,
} from "integrations/domain"

@Injectable()
export class CreatePostLikeService {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async call(input: { postId: Id; userId: Id }) {
    const postEntity = await this.postRepository.find(input.postId)

    if (postEntity === null) {
      throw new NotFoundError()
    }

    const likeEntity = new LikeEntity({
      id: IdFactory.create(),
      postId: input.postId,
      userId: input.userId,
    })

    await this.likeRepository.upsert(likeEntity)

    const notificationEntity = new NotificationEntity({
      friendshipId: null,
      id: IdFactory.create(),
      isRead: false,
      likeId: likeEntity.id,
      postId: input.postId,
      relatedUserId: input.userId,
      type: new NotificationType("LIKE"),
      userId: postEntity.userId,
    })

    await this.notificationRepository.upsert(notificationEntity)

    return null
  }
}
