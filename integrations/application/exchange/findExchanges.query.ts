import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindExchangesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const exchanges = await db.exchange.findMany({
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

      return exchanges.map((exchange) => {
        return this.queryConverter.toUserExchange(exchange)
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
