import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { AppUserEmbeddedConverter } from "infrastructure"
import { PrismaMessage } from "infrastructure/types/prismaMessage"
import { InternalError } from "integrations/errors"
import { AppMessage } from "integrations/types"

type Props = {
  relatedUserId: Id
  skip: number
  userId: Id
}

@injectable()
export class FindUserMessagesQuery {
  constructor(private appUserEmbeddedConverter: AppUserEmbeddedConverter) {}

  async execute(props: Props) {
    try {
      const messages = await db.message.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 20,
        where: {
          threads: {
            some: { userId: props.userId.value },
          },
        },
        include: {
          user: { include: { iconImage: true } },
        },
      })

      return messages.map((prismaMessage) => {
        return this.toUserMessage(prismaMessage)
      })
    } catch (error) {
      captureException(error)
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
