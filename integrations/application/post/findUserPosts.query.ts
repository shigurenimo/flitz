import db from "db"
import { Id, Username } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindUserPostsQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
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
      take: props.take,
      where: { user: { username: props.username.value } },
    })

    return posts.map((post) => {
      return this.queryConverter.toFeedPost(post)
    })
  }
}
