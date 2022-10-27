import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { AppUserEmbeddedConverter } from "infrastructure"
import { prismaMessageThread } from "infrastructure/types"
import { InternalError } from "integrations/errors"
import { AppMessageThread } from "integrations/types"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindMessageThreadsQuery {
  constructor(private appUserEmbeddedConverter: AppUserEmbeddedConverter) {}

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
        return this.toMessageThread(prismaMessageThread)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }

  toMessageThread(prismaMessageThread: prismaMessageThread): AppMessageThread {
    const [message] = prismaMessageThread.messages

    return {
      id: prismaMessageThread.id,
      createdAt: prismaMessageThread.createdAt,
      isRead: prismaMessageThread.isRead,
      lastMessage: {
        id: message.id,
        createdAt: message.createdAt,
        text: message.text,
        userId: message.userId,
      },
      relatedUser: this.appUserEmbeddedConverter.fromPrisma(
        prismaMessageThread.relatedUser
      ),
    }
  }
}
