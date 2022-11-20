import { AppFriendship } from "infrastructure/models"
import { PrismaFollowee } from "infrastructure/types"

export const toAppFriendshipFollowee = (
  data: PrismaFollowee
): AppFriendship => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    userId: data.followee.id,
    username: data.followee.username || null,
    name: data.followee.name || null,
    biography: data.followee.biography,
    isFollowee: 0 < data.followee.followeesCount,
    isFollower: 0 < data.followee.followersCount,
  }
}
