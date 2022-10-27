import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { AppUserEmbeddedConverter } from "infrastructure"
import { PrismaMessage } from "infrastructure/types/prismaMessage"
import { InternalError } from "integrations/errors"
import { AppMessage } from "integrations/types"

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
