import { Injectable } from "@nestjs/common"
import db from "db"
import {
  Count,
  Id,
  Skip,
  Take,
  Username,
} from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"

@Injectable()
export class UserLikeQuery {
  constructor(private prismaConverter: QueryConverter) {}

  async count(username: Username) {
    const count = await db.like.count({
      where: { user: { username: username.value } },
    })

    return new Count(count)
  }

  async findMany(input: {
    userId: Id | null
    skip: Skip
    take: Take
    username: Username
  }): Promise<QueryFeedPost[]> {
    const likes = await db.like.findMany({
      include: {
        post: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotation: { include: includeEmbededPost(input.userId) },
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            reply: { include: includeEmbededPost(input.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })

    return likes.map((like) => {
      return this.prismaConverter.toFeedPost(like.post)
    })
  }
}
