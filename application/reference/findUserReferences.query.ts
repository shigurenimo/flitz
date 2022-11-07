import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { toAppFolloweePost } from "infrastructure/utils"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindUserReferenceQuery {
  async execute(props: Props) {
    try {
      const references = await db.reference.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
        where: { userId: props.userId.value },
        include: {
          post: {
            include: {
              files: true,
              likes: { where: { userId: props.userId.value } },
              quotation: { include: includePostEmbedded(props.userId) },
              quotations: { where: { userId: props.userId.value } },
              replies: { where: { userId: props.userId.value } },
              reply: { include: includePostEmbedded(props.userId) },
              user: { include: { iconImage: true } },
            },
          },
        },
      })

      return references.map((reference) => {
        return toAppFolloweePost(reference)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
