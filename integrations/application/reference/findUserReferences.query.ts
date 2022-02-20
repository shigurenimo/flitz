import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters/query.converter"
import { includeReplyPost } from "integrations/infrastructure/utils/includeReplyPost"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindUserReferenceQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
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
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
