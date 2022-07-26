import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { AppUserEmbeddedConverter } from "integrations/infrastructure"
import { PrismaMessage } from "integrations/infrastructure/types/prismaMessage"
import { AppMessage } from "integrations/interface/types"

type Props = {
  messageThreadId: Id
  skip: number
}

@injectable()
export class FindGroupMessagesQuery {
  constructor(private appUserEmbeddedConverter: AppUserEmbeddedConverter) {}

  async execute(props: Props) {
    try {
      const prismaMessageThread = await db.messageThread.findUnique({
        where: { id: props.messageThreadId.value },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20,
            skip: props.skip,
            include: {
              user: { include: { iconImage: true } },
            },
          },
        },
      })

      if (prismaMessageThread === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      return prismaMessageThread.messages.map((prismaMessage) => {
        return this.toUserMessage(prismaMessage)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toUserMessage(prismaMessage: PrismaMessage): AppMessage {
    return {
      id: prismaMessage.id,
      createdAt: prismaMessage.createdAt,
      isRead: prismaMessage.isRead,
      text: prismaMessage.text,
      updatedAt: prismaMessage.updatedAt,
      user: this.appUserEmbeddedConverter.fromPrisma(prismaMessage.user),
    }
  }
}
