import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { AppUserEmbeddedConverter } from "integrations/infrastructure"
import { PrismaMessage } from "integrations/infrastructure/types/prismaMessage"
import { AppMessage } from "integrations/interface/types"
import { injectable } from "tsyringe"

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
      const prismaMessages = await db.message.findMany({
        include: {
          user: { include: { iconImage: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 20,
        where: {
          threads: {
            some: { userId: props.userId.value },
          },
        },
      })

      return prismaMessages.map((prismaMessage) => {
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
