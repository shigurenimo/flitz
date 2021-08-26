import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip, Take, Username } from "integrations/domain"
import { ViewConverter } from "integrations/infrastructure/converters"
import { AppFollower } from "integrations/interface/types/appFollower"

@Injectable()
export class UserFolloweeQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { follower: { username: input.username.value } },
    })

    return new Count(count)
  }

  async findByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<AppFollower[]> {
    const friendships = await db.friendship.findMany({
      include: {
        followee: {
          include: {
            followees: input.userId
              ? { where: { followeeId: input.userId.value } }
              : false,
            followers: input.userId
              ? { where: { followerId: input.userId.value } }
              : false,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { follower: { username: input.username.value } },
    })

    return friendships.map((friendship) => {
      return this.queryConverter.toFollowee(friendship)
    })
  }
}
