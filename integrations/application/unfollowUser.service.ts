import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import { FriendshipRepository, Id } from "integrations/domain"

@Injectable()
export class UnfollowUserService {
  constructor(private friendshipRepository: FriendshipRepository) {}

  async call(input: { followeeId: Id; followerId: Id }) {
    try {
      if (input.followerId.value === input.followeeId.value) {
        throw new Error("Unexpected error")
      }

      const friendshipEntity = await this.friendshipRepository.find(
        input.followerId,
        input.followeeId
      )

      if (friendshipEntity === null) {
        throw new NotFoundError()
      }

      await this.friendshipRepository.unfollow(friendshipEntity)
    } catch (error) {
      return Error()
    }
  }
}
