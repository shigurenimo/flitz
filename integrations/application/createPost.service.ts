import { Injectable } from "@nestjs/common"
import {
  Count,
  FriendshipRepository,
  Id,
  IdFactory,
  PostEntity,
  PostRepository,
  PostText,
} from "integrations/domain"

@Injectable()
export class CreatePostService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository
  ) {}

  async call(input: { fileIds: Id[]; text: PostText; userId: Id }) {
    const friendshipEntities = await this.friendshipRepository.findManyByFolloweeId(
      input.userId
    )

    const postEntity = new PostEntity({
      fileIds: input.fileIds,
      id: IdFactory.create(),
      quotationId: null,
      quotationsCount: new Count(0),
      repliesCount: new Count(0),
      replyId: null,
      text: input.text,
      userId: input.userId,
      followerIds: friendshipEntities.map((friendshipEntity) => {
        return friendshipEntity.followerId
      }),
    })

    await this.postRepository.upsert(postEntity)

    return null
  }
}
