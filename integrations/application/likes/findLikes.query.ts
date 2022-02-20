import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import { injectable } from "tsyringe"

type Props = {
  userId: Id | null
  skip: number
  take: number
  username: Username
}

@injectable()
export class FindLikeQuery {
  constructor(private prismaConverter: QueryConverter) {}

  async execute(input: Props): Promise<AppFeedPost[]> {
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
      skip: input.skip,
      take: input.take,
      where: { user: { username: input.username.value } },
    })

    return likes.map((like) => {
      return this.prismaConverter.toFeedPost(like.post)
    })
  }
}
