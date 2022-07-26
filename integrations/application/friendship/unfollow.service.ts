import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { FriendshipRepository } from "integrations/infrastructure"

type Props = {
  followeeId: Id
  followerId: Id
}

@injectable()
export class UnfollowService {
  constructor(private friendshipRepository: FriendshipRepository) {}

  async execute(props: Props) {
    try {
      if (props.followerId.value === props.followeeId.value) {
        return new InternalError("自分自身をフォローすることは出来ません。")
      }

      const friendship = await this.friendshipRepository.find(
        props.followerId,
        props.followeeId
      )

      if (friendship instanceof Error) {
        return new InternalError()
      }

      if (friendship === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      const transaction = await this.friendshipRepository.unfollow(friendship)

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
