import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters/query.converter"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { AppFeed } from "integrations/interface/types/appFeed"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindReferenceQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props): Promise<AppFeed[]> {
    const references = await db.reference.findMany({
      include: {
        post: {
          include: {
            files: true,
            likes: { where: { userId: props.userId.value } },
            quotation: { include: includeReplyPost(props.userId) },
            quotations: { where: { userId: props.userId.value } },
            replies: { where: { userId: props.userId.value } },
            reply: { include: includeReplyPost(props.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: 16,
      where: { userId: props.userId.value },
    })

    return references.map((reference) => {
      return this.queryConverter.toFeed(reference)
    })
  }
}
