import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, IdFactory, PostEntity, PostText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  FriendshipRepository,
  PostRepository,
} from "integrations/infrastructure"

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

  /**
   * 新しいポストを作成する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const friendships = await this.friendshipRepository.findManyByFolloweeId(
        props.userId
      )

      if (friendships instanceof Error) {
        return new InternalError()
      }

      const post = new PostEntity({
        fileIds: props.fileIds,
        id: IdFactory.nanoid(),
        quotationId: null,
        quotationsCount: 0,
        repliesCount: 0,
        replyId: null,
        text: props.text,
        userId: props.userId,
        followerIds: friendships.map((friendship) => {
          return friendship.followerId
        }),
      })

      const transaction = await this.postRepository.upsert(post)

      if (transaction instanceof Error) {
        return new InternalError()
      }

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
