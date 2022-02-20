import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  exchangeId: Id
  skip: number
}

@injectable()
export class FindGroupMessagesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const exchange = await db.exchange.findUnique({
        include: {
          // user: { include: { iconImage: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20,
            skip: props.skip,
            include: {
              user: { include: { iconImage: true } },
            },
          },
        },
        where: { id: props.exchangeId.value },
      })

      if (exchange === null) {
        return new NotFoundError()
      }

      return exchange.messages.map((message) => {
        return this.queryConverter.toUserMessage(message)
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
