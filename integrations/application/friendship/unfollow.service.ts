import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { FriendshipRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

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
        throw new Error("Unexpected error")
      }

      const friendship = await this.friendshipRepository.find(
        props.followerId,
        props.followeeId
      )

      if (friendship === null) {
        throw new NotFoundError()
      }

      await this.friendshipRepository.unfollow(friendship)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
