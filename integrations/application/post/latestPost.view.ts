import db from "db"
import { Id } from "integrations/domain"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id | null
}

@injectable()
export class LatestPostQuery {
  constructor(private queryConverter: ViewConverter) {}

  async findMany(props: Props): Promise<AppFeedPost[]> {
    const posts = await db.post.findMany({
      include: {
        files: true,
        likes: props.userId ? { where: { userId: props.userId.value } } : false,
        quotation: { include: includeReplyPost(props.userId) },
        quotations: props.userId
          ? { where: { userId: props.userId.value } }
          : false,
        replies: props.userId
          ? { where: { userId: props.userId.value } }
          : false,
        reply: { include: includeReplyPost(props.userId) },
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: 16,
    })

    return posts.map((post) => {
      return this.queryConverter.toFeedPost(post)
    })
  }
}
