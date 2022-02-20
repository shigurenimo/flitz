import db from "db"
import { Id } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import { injectable } from "tsyringe"

type Props = {
  postId: Id
  userId: Id | null
}

@injectable()
export class FindPostQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props): Promise<AppFeedPost | null> {
    const post = await db.post.findUnique({
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
      where: { id: props.postId.value },
    })

    if (post === null) {
      return null
    }

    return this.queryConverter.toFeedPost(post)
  }
}
