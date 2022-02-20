import { captureException } from "@sentry/node"
import { Id, IdFactory, PostEntity, PostText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  FriendshipRepository,
  PostRepository,
} from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  fileIds: Id[]
  text: PostText
  userId: Id
}

@injectable()
export class CreatePostService {
  constructor(
    private postRepository: PostRepository,
    private friendshipRepository: FriendshipRepository
  ) {}

  async execute(props: Props) {
    try {
      const friendships = await this.friendshipRepository.findManyByFolloweeId(
        props.userId
      )

      const post = new PostEntity({
        fileIds: props.fileIds,
        id: IdFactory.nanoid(),
        quotationId: null,
        quotationsCount: 0,
        repliesCount: 0,
        replyId: null,
        text: props.text,
        userId: props.userId,
        followerIds: friendships.map((friendshipEntity) => {
          return friendshipEntity.followerId
        }),
      })

      await this.postRepository.upsert(post)

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
