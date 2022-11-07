import { PrismaFollower } from "infrastructure/types"
import { AppFriendship } from "integrations/types"

export const toAppFriendshipFollower = (
  data: PrismaFollower
): AppFriendship => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    userId: data.follower.id,
    username: data.follower.username || null,
    name: data.follower.name || null,
    biography: data.follower.biography,
    isFollowee: 0 < data.follower.followeesCount,
    isFollower: 0 < data.follower.followersCount,
  }
}
