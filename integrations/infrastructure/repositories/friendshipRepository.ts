import db from "db"
import { IFriendshipRepository } from "integrations/domain/repositories"
import { Id } from "integrations/domain/valueObjects"
import { PrismaAdapter } from "integrations/infrastructure/adapters/prismaAdapter"

export class FriendshipRepository implements IFriendshipRepository {
  async getUserFollowers(input: { followeeId: Id }) {
    const friendships = await db.friendship.findMany({
      where: { followeeId: input.followeeId.value },
      take: 20000,
    })

    const friendshipEntities = friendships.map((friendship) => {
      return new PrismaAdapter().toFriendshipEntity(friendship)
    })

    return { friendships, friendshipEntities }
  }
}
