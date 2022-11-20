import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { AppMessageThread } from "infrastructure/models"
import { toAppMessageThread } from "infrastructure/utils/toAppMessageThread"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindMessageThreadsQuery {
  async execute(props: Props): Promise<AppMessageThread[] | Error> {
    try {
      const messageThread = await db.messageThread.findMany({
        orderBy: { updatedAt: "desc" },
        skip: props.skip,
        take: 16,
        where: { userId: props.userId.value },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          relatedUser: { include: { iconImage: true } },
        },
      })

      return messageThread.map((prismaMessageThread) => {
        return toAppMessageThread(prismaMessageThread)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
