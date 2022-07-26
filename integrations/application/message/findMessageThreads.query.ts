import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { AppUserEmbeddedConverter } from "integrations/infrastructure"
import { prismaMessageThread } from "integrations/infrastructure/types"
import { AppMessageThread } from "integrations/interface/types"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindMessageThreadsQuery {
  constructor(private appUserEmbeddedConverter: AppUserEmbeddedConverter) {}

  async execute(props: Props): Promise<AppMessageThread[] | Error> {
    try {
      const prismaMessageThread = await db.messageThread.findMany({
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

      return prismaMessageThread.map((prismaMessageThread) => {
        return this.toMessageThread(prismaMessageThread)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

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
