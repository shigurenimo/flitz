import db from "db"
import { Id } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  replyId: Id
  userId: Id | null
}

@injectable()
export class FindUserRepliesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    const posts = await db.post.findMany({
      include: includeReplyPost(props.userId),
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: props.take,
      where: { replyId: props.replyId.value },
    })

    return posts.map((post) => {
      return this.queryConverter.toQuotation(post)
    })
  }
}
