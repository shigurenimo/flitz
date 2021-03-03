import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip, Take, Username } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { QueryFollower } from "integrations/interface/types/queryFollower"

@Injectable()
export class UserFolloweerQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(input: { username: Username }) {
    const count = await db.friendship.count({
      where: { followee: { username: input.username.value } },
    })

    return new Count(count)
  }

  async findByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<QueryFollower[]> {
    const friendships = await db.friendship.findMany({
      include: {
        follower: {
          include: {
            // 自分にフォローされているかどうか
            followees: input.userId
              ? { where: { followeeId: input.userId.value } }
              : false,
            // 自分をフォローしているかどうか
            followers: input.userId
              ? { where: { followerId: input.userId.value } }
              : false,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { followee: { username: input.username.value } },
    })

    return friendships.map((friendship) => {
      return this.queryConverter.toFollower(friendship)
    })
  }
}
